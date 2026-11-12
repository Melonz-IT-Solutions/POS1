<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDiscountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create discounts');
    }

    public function rules(): array
    {
        return [
            'name'            => ['required', 'string', 'max:100'],
            'code'            => ['nullable', 'string', 'max:50', 'unique:discounts,code'],
            'type'            => ['required', Rule::in(['percentage', 'fixed'])],
            'value'           => ['required', 'numeric', 'min:0.01'],
            'min_purchase'    => ['nullable', 'numeric', 'min:0'],
            'start_at'        => ['nullable', 'date'],
            'end_at'          => ['nullable', 'date', 'after_or_equal:start_at'],
            'is_active'       => ['boolean'],
            'scope'           => ['required', Rule::in(['all', 'products', 'categories', 'customers'])],
            'product_ids'     => ['nullable', 'array'],
            'product_ids.*'   => ['integer', 'exists:products,id'],
            'category_ids'    => ['nullable', 'array'],
            'category_ids.*'  => ['integer', 'exists:categories,id'],
            'customer_ids'    => ['nullable', 'array'],
            'customer_ids.*'  => ['integer', 'exists:customers,id'],
        ];
    }
}
