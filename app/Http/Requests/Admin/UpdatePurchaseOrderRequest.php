<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePurchaseOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create purchase orders');
    }

    public function rules(): array
    {
        return [
            'supplier_id'            => ['required', 'integer', 'exists:suppliers,id'],
            'expected_date'          => ['nullable', 'date'],
            'notes'                  => ['nullable', 'string', 'max:1000'],
            'mark_ordered'           => ['boolean'],
            'items'                  => ['required', 'array', 'min:1'],
            'items.*.product_id'     => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity'       => ['required', 'integer', 'min:1'],
            'items.*.unit_cost'      => ['required', 'numeric', 'min:0'],
        ];
    }
}
