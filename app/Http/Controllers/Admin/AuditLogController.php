<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->hasPermissionTo('view audit logs'), 403);

        $query = AuditLog::with('user:id,name')
            ->latest('created_at');

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('action')) {
            $query->where('action', 'like', "%{$request->action}%");
        }

        if ($request->filled('model')) {
            $query->where('auditable_type', 'like', "%{$request->model}%");
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs  = $query->paginate(30)->withQueryString();
        $users = User::orderBy('name')->get(['id', 'name']);

        // Distinct actions for filter dropdown
        $actions = AuditLog::distinct()->orderBy('action')->pluck('action');

        return Inertia::render('audit/Index', [
            'logs'    => $logs,
            'users'   => $users,
            'actions' => $actions,
            'filters' => $request->only(['user_id', 'action', 'model', 'date_from', 'date_to']),
        ]);
    }

    public function show(AuditLog $auditLog): Response
    {
        abort_unless(auth()->user()->hasPermissionTo('view audit logs'), 403);

        $auditLog->load('user:id,name,email');

        return Inertia::render('audit/Show', [
            'log' => $auditLog,
        ]);
    }
}
