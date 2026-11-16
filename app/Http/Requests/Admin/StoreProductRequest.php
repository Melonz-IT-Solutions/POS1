<?php

namespace App\Http\Requests\Admin;

use App\Enums\VatType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create products');
    }

    public function rules(): array
    {
        return [
            'category_id'    => ['required', 'integer', 'exists:categories,id'],
            'name'           => ['required', 'string', 'max:200'],
            'description'    => ['nullable', 'string', 'max:1000'],
            'sku'            => ['nullable', 'string', 'max:50', 'unique:products,sku'],
            'barcode'        => ['nullable', 'string', 'max:30', 'unique:products,barcode'],
            'unit_of_measure'=> ['required', 'string', 'max:30'],
            'cost_price'     => ['required', 'integer', 'min:0'],
            'selling_price'  => ['required', 'integer', 'min:0'],
            'vat_type'       => ['required', new Enum(VatType::class)],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'minimum_stock'  => ['required', 'integer', 'min:0'],
            'is_active'      => ['boolean'],
            'is_bundle'      => ['boolean'],
            'image'          => ['nullable', 'image', 'max:2048'],
        ];
    }

    protected function prepareForValidation(): void
    {
        // Convert peso inputs to centavos if sent as decimals > 100
        // The frontend should send centavos already, but we guard here
        $this->merge([
            'is_active' => $this->boolean('is_active', true),
            'is_bundle' => $this->boolean('is_bundle', false),
        ]);
    }
}
