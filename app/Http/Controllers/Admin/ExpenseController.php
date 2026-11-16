<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Expense;
use App\Models\Shift;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Expense::class);

        $query = Expense::with('recorder:id,name')
            ->orderByDesc('expense_date')
            ->orderByDesc('id');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('expense_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('expense_date', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $like = '%' . $request->search . '%';
            $query->where(function ($q) use ($like) {
                $q->where('description', 'like', $like)
                  ->orWhere('reference', 'like', $like);
            });
        }

        // Summary for the current filter window
        $summaryQuery = clone $query;
        $totalFiltered = $summaryQuery->sum('amount');

        // This month totals (always shown)
        $thisMonthTotal = Expense::whereYear('expense_date', now()->year)
            ->whereMonth('expense_date', now()->month)
            ->sum('amount');

        $thisYearTotal = Expense::whereYear('expense_date', now()->year)
            ->sum('amount');

        $byCategory = Expense::selectRaw('category, SUM(amount) as total')
            ->whereYear('expense_date', now()->year)
            ->whereMonth('expense_date', now()->month)
            ->groupBy('category')
            ->pluck('total', 'category');

        return Inertia::render('expenses/Index', [
            'expenses'       => $query->paginate(25)->withQueryString(),
            'categories'     => Expense::categories(),
            'filters'        => $request->only(['category', 'date_from', 'date_to', 'search']),
            'totalFiltered'  => (int) $totalFiltered,
            'thisMonthTotal' => (int) $thisMonthTotal,
            'thisYearTotal'  => (int) $thisYearTotal,
            'byCategory'     => $byCategory,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Expense::class);

        return Inertia::render('expenses/Create', [
            'categories' => Expense::categories(),
            'shifts'     => Shift::where('status', 'open')
                ->with('cashier:id,name')
                ->orderByDesc('opened_at')
                ->get(['id', 'cashier_id', 'opened_at']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Expense::class);

        $data = $request->validate([
            'category'     => ['required', 'string', 'in:' . implode(',', array_keys(Expense::categories()))],
            'description'  => ['required', 'string', 'max:255'],
            'amount'       => ['required', 'numeric', 'min:0.01'],
            'expense_date' => ['required', 'date'],
            'reference'    => ['nullable', 'string', 'max:100'],
            'shift_id'     => ['nullable', 'integer', 'exists:shifts,id'],
            'notes'        => ['nullable', 'string', 'max:1000'],
        ]);

        $expense = Expense::create([
            'category'     => $data['category'],
            'description'  => $data['description'],
            'amount'       => (int) round((float) $data['amount'] * 100),
            'expense_date' => $data['expense_date'],
            'reference'    => $data['reference'] ?? null,
            'shift_id'     => $data['shift_id'] ?? null,
            'recorded_by'  => auth()->id(),
            'notes'        => $data['notes'] ?? null,
        ]);

        AuditLog::record('expense.create', $expense, [], $expense->toArray());

        return redirect()->route('admin.expenses.index')
            ->with('success', 'Expense recorded.');
    }

    public function edit(Expense $expense): Response
    {
        $this->authorize('update', $expense);

        return Inertia::render('expenses/Edit', [
            'expense'    => $expense->load('recorder:id,name'),
            'categories' => Expense::categories(),
            'shifts'     => Shift::with('cashier:id,name')
                ->orderByDesc('opened_at')
                ->limit(50)
                ->get(['id', 'cashier_id', 'opened_at']),
        ]);
    }

    public function update(Request $request, Expense $expense): RedirectResponse
    {
        $this->authorize('update', $expense);

        $data = $request->validate([
            'category'     => ['required', 'string', 'in:' . implode(',', array_keys(Expense::categories()))],
            'description'  => ['required', 'string', 'max:255'],
            'amount'       => ['required', 'numeric', 'min:0.01'],
            'expense_date' => ['required', 'date'],
            'reference'    => ['nullable', 'string', 'max:100'],
            'shift_id'     => ['nullable', 'integer', 'exists:shifts,id'],
            'notes'        => ['nullable', 'string', 'max:1000'],
        ]);

        $before = $expense->toArray();

        $expense->update([
            'category'     => $data['category'],
            'description'  => $data['description'],
            'amount'       => (int) round((float) $data['amount'] * 100),
            'expense_date' => $data['expense_date'],
            'reference'    => $data['reference'] ?? null,
            'shift_id'     => $data['shift_id'] ?? null,
            'notes'        => $data['notes'] ?? null,
        ]);

        AuditLog::record('expense.update', $expense, $before, $expense->fresh()->toArray());

        return redirect()->route('admin.expenses.index')
            ->with('success', 'Expense updated.');
    }

    public function destroy(Expense $expense): RedirectResponse
    {
        $this->authorize('delete', $expense);

        AuditLog::record('expense.delete', $expense, $expense->toArray(), []);
        $expense->delete();

        return redirect()->route('admin.expenses.index')
            ->with('success', 'Expense deleted.');
    }
}
