<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        $query = User::with('roles')
            ->withTrashed()
            ->where('id', '!=', $request->user()->id) // never show yourself in the list to avoid accidental deletion
            ->orderBy('name');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->input('search') . '%')
                  ->orWhere('email', 'like', '%' . $request->input('search') . '%');
            });
        }

        if ($request->filled('role')) {
            $query->whereHas('roles', fn ($q) => $q->where('name', $request->input('role')));
        }

        if ($request->filled('status')) {
            match ($request->input('status')) {
                'active'   => $query->whereNull('deleted_at')->where('status', 'active'),
                'inactive' => $query->whereNull('deleted_at')->where('status', 'inactive'),
                'deleted'  => $query->whereNotNull('deleted_at'),
                default    => null,
            };
        }

        return Inertia::render('users/Index', [
            'users'   => $query->paginate(25)->withQueryString(),
            'roles'   => Role::orderBy('name')->pluck('name'),
            'filters' => $request->only(['search', 'role', 'status']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', User::class);

        return Inertia::render('users/Create', [
            'roles' => Role::orderBy('name')->pluck('name'),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $user = User::create([
            'name'               => $request->input('name'),
            'email'              => $request->input('email'),
            'password'           => Hash::make($request->input('password')),
            'status'             => $request->input('status', 'active'),
            'email_verified_at'  => now(), // admin-created users are pre-verified
        ]);

        $user->syncRoles([$request->input('role')]);

        if ($request->filled('pin')) {
            $user->setPin($request->input('pin'));
        }

        AuditLog::record('user.create', $user, [], ['name' => $user->name, 'email' => $user->email, 'role' => $request->input('role')]);

        return redirect()->route('admin.users.index')
            ->with('success', "User \"{$user->name}\" created.");
    }

    public function show(User $user): Response
    {
        $this->authorize('view', $user);

        $user->load('roles');
        $allPermissions = $user->getAllPermissions()->pluck('name')->sort()->values();

        $stats = [
            'total_sales'   => $user->sales()->where('status', 'completed')->count(),
            'total_revenue' => (int) $user->sales()->where('status', 'completed')->sum('total_amount'),
            'total_shifts'  => $user->shifts()->count(),
            'void_count'    => $user->sales()->where('status', 'void')->count(),
        ];

        $recentSales = $user->sales()
            ->whereIn('status', ['completed', 'void'])
            ->with('customer:id,name')
            ->latest()
            ->limit(8)
            ->get(['id', 'receipt_number', 'total_amount', 'customer_id', 'created_at', 'status']);

        $recentActivity = \App\Models\AuditLog::where('user_id', $user->id)
            ->latest()
            ->limit(10)
            ->get(['id', 'action', 'auditable_type', 'created_at']);

        return Inertia::render('users/Show', [
            'user'           => $user,
            'permissions'    => $allPermissions,
            'stats'          => $stats,
            'recentSales'    => $recentSales,
            'recentActivity' => $recentActivity,
            'canEdit'        => auth()->user()->can('update', $user),
        ]);
    }

    public function edit(User $user): Response
    {
        $this->authorize('update', $user);

        return Inertia::render('users/Edit', [
            'user'  => $user->load('roles'),
            'roles' => Role::orderBy('name')->pluck('name'),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $old = ['name' => $user->name, 'email' => $user->email, 'status' => $user->status];

        $user->update([
            'name'   => $request->input('name'),
            'email'  => $request->input('email'),
            'status' => $request->input('status'),
        ]);

        $user->syncRoles([$request->input('role')]);

        AuditLog::record('user.update', $user, $old, ['name' => $user->name, 'email' => $user->email, 'role' => $request->input('role')]);

        return redirect()->route('admin.users.index')
            ->with('success', "User \"{$user->name}\" updated.");
    }

    public function destroy(User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        $old = ['name' => $user->name, 'email' => $user->email];
        $user->delete();

        AuditLog::record('user.delete', null, $old, []);

        return redirect()->route('admin.users.index')
            ->with('success', "User \"{$user->name}\" deactivated.");
    }

    public function restore(int $id): RedirectResponse
    {
        $user = User::withTrashed()->findOrFail($id);
        $this->authorize('restore', $user);

        $user->restore();

        AuditLog::record('user.restore', $user, [], ['name' => $user->name]);

        return back()->with('success', "User \"{$user->name}\" restored.");
    }

    public function resetPassword(Request $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user->update(['password' => Hash::make($request->input('password'))]);

        AuditLog::record('user.password_reset', $user, [], ['reset_by' => $request->user()->name]);

        return back()->with('success', 'Password reset successfully.');
    }

    public function setPin(Request $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $request->validate([
            'pin' => ['required', 'digits:6', 'confirmed'],
        ]);

        $user->setPin($request->input('pin'));

        AuditLog::record('user.pin_set', $user, [], ['set_by' => $request->user()->name]);

        return back()->with('success', 'POS PIN updated.');
    }
}
