<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\AuditLog;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::withCount('products')
            ->with('parent:id,name')
            ->withTrashed()
            ->roots()
            ->with(['children' => fn ($q) => $q->withCount('products')->withTrashed()])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('categories/Create', [
            'parentCategories' => Category::active()->roots()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $category = Category::create($request->validated());

        AuditLog::record('category.create', $category, [], $category->toArray());

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function show(Category $category): Response
    {
        $this->authorize('view', $category);

        $category->load([
            'parent:id,name',
            'children' => fn ($q) => $q->withCount('products')->withTrashed(),
        ]);

        $products = $category->products()
            ->with('category:id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'sku', 'selling_price', 'stock_quantity', 'minimum_stock', 'is_active', 'deleted_at']);

        $stats = [
            'total_products'  => $products->count(),
            'active_products' => $products->whereNull('deleted_at')->where('is_active', true)->count(),
            'total_stock'     => (int) $products->whereNull('deleted_at')->sum('stock_quantity'),
            'stock_value'     => (int) $products->whereNull('deleted_at')->sum(fn ($p) => $p->stock_quantity * $p->selling_price),
        ];

        return Inertia::render('categories/Show', [
            'category' => $category,
            'products' => $products,
            'stats'    => $stats,
            'canEdit'  => auth()->user()->can('update', $category),
        ]);
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('categories/Edit', [
            'category'         => $category->load('parent:id,name'),
            'parentCategories' => Category::active()->roots()
                ->where('id', '!=', $category->id)
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $old = $category->toArray();
        $category->update($request->validated());

        AuditLog::record('category.update', $category, $old, $category->fresh()->toArray());

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $this->authorize('delete', $category);

        if ($category->products()->count() > 0) {
            return back()->with('error', 'Cannot delete a category that has products. Reassign products first.');
        }

        $old = $category->toArray();
        $category->delete();

        AuditLog::record('category.delete', null, $old, []);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category deleted.');
    }

    public function restore(int $id): RedirectResponse
    {
        $category = Category::withTrashed()->findOrFail($id);
        $this->authorize('restore', $category);

        $category->restore();

        AuditLog::record('category.restore', $category, [], $category->toArray());

        return back()->with('success', 'Category restored.');
    }
}
