<?php

namespace App\Http\Requests\POS;

use Illuminate\Foundation\Http\FormRequest;

class StoreSaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create sales') || $this->user()->hasRole(['Administrator', 'Manager', 'Cashier']);
    }

    public function rules(): array
    {
        return [
            'items'                  => ['required', 'array', 'min:1'],
            'items.*.product_id'     => ['required', 'integer', 'exists:products,id'],
            'items.*.product_name'   => ['required', 'string', 'max:255'],
            'items.*.product_sku'    => ['required', 'string', 'max:100'],
            'items.*.product_barcode'=> ['nullable', 'string', 'max:50'],
            'items.*.unit_price'     => ['required', 'integer', 'min:0'],
            'items.*.cost_price'     => ['required', 'integer', 'min:0'],
            'items.*.vat_type'       => ['required', 'string', 'in:vatable,vat_exempt,zero_rated'],
            'items.*.quantity'       => ['required', 'integer', 'min:1'],
            'items.*.discount_type'  => ['nullable', 'string', 'in:percentage,fixed'],
            'items.*.discount_value' => ['nullable', 'integer', 'min:0'],

            'payments'                       => ['required', 'array', 'min:1'],
            'payments.*.payment_method'      => ['required', 'string', 'max:30'],
            'payments.*.amount'              => ['required', 'integer', 'min:1'],
            'payments.*.reference_number'    => ['nullable', 'string', 'max:100'],

            'customer_id'    => ['nullable', 'integer', 'exists:customers,id'],
            'discount_type'  => ['nullable', 'string', 'in:percentage,fixed'],
            'discount_value' => ['nullable', 'integer', 'min:0'],
            'notes'          => ['nullable', 'string', 'max:500'],

            // Senior/PWD
            'sc_name'   => ['nullable', 'string', 'max:255'],
            'sc_id_no'  => ['nullable', 'string', 'max:50'],
            'pwd_name'  => ['nullable', 'string', 'max:255'],
            'pwd_id_no' => ['nullable', 'string', 'max:50'],
        ];
    }
}
