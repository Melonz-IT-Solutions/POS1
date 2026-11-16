<?php

namespace App\Http\Requests\Admin;

use App\Enums\VatType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('edit products');
    }

    public function rules(): array
    {
        $product = $this->route('product');

        return [
            'category_id'         => ['required', 'integer', 'exists:categories,id'],
            'name'                => ['required', 'string', 'max:200'],
            'description'         => ['nullable', 'string', 'max:1000'],
            'sku'                 => ['nullable', 'string', 'max:50', Rule::unique('products', 'sku')->ignore($product->id)],
            'barcode'             => ['nullable', 'string', 'max:30', Rule::unique('products', 'barcode')->ignore($product->id)],
            'unit_of_measure'     => ['required', 'string', 'max:30'],
            'cost_price'          => ['required', 'integer', 'min:0'],
            'selling_price'       => ['required', 'integer', 'min:0'],
            'vat_type'            => ['required', new Enum(VatType::class)],
            'minimum_stock'       => ['required', 'integer', 'min:0'],
            'is_active'           => ['boolean'],
            'is_bundle'           => ['boolean'],
            'image'               => ['nullable', 'image', 'max:2048'],
            'price_change_reason' => ['nullable', 'string', 'max:200'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active', true),
            'is_bundle' => $this->boolean('is_bundle', false),
        ]);
    }
}
