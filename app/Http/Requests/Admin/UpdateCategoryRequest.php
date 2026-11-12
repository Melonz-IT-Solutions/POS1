<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('manage categories');
    }

    public function rules(): array
    {
        $category = $this->route('category');

        return [
            'name'        => ['required', 'string', 'max:100'],
            'slug'        => ['nullable', 'string', 'max:120', Rule::unique('categories', 'slug')->ignore($category->id)],
            'description' => ['nullable', 'string', 'max:500'],
            'parent_id'   => ['nullable', 'integer', 'exists:categories,id', Rule::notIn([$category->id])],
            'is_active'   => ['boolean'],
            'sort_order'  => ['integer', 'min:0'],
        ];
    }
}
