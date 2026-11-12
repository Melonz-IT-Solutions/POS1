<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('edit suppliers');
    }

    public function rules(): array
    {
        return [
            'company_name'   => ['required', 'string', 'max:150'],
            'contact_person' => ['nullable', 'string', 'max:100'],
            'phone'          => ['nullable', 'string', 'max:30'],
            'email'          => ['nullable', 'email', 'max:150'],
            'address'        => ['nullable', 'string', 'max:500'],
            'tin'            => ['nullable', 'string', 'max:20'],
            'is_active'      => ['boolean'],
            'product_ids'    => ['nullable', 'array'],
            'product_ids.*'  => ['integer', 'exists:products,id'],
        ];
    }
}
