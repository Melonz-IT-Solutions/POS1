<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('manage categories');
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:100'],
            'slug'        => ['nullable', 'string', 'max:120', 'unique:categories,slug'],
            'description' => ['nullable', 'string', 'max:500'],
            'parent_id'   => ['nullable', 'integer', 'exists:categories,id'],
            'is_active'   => ['boolean'],
            'sort_order'  => ['integer', 'min:0'],
        ];
    }
}
