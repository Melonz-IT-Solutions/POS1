<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create customers');
    }

    public function rules(): array
    {
        return [
            'name'          => ['required', 'string', 'max:150'],
            'phone'         => ['nullable', 'string', 'max:30'],
            'email'         => ['nullable', 'email', 'max:150', 'unique:customers,email'],
            'address'       => ['nullable', 'string', 'max:300'],
            'notes'         => ['nullable', 'string', 'max:500'],
            'discount_rate' => ['integer', 'min:0', 'max:10000'],
            'is_active'     => ['boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active'     => $this->boolean('is_active', true),
            'discount_rate' => (int) $this->input('discount_rate', 0),
        ]);
    }
}
