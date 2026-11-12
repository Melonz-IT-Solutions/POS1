<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StockAdjustmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('adjust inventory');
    }

    public function rules(): array
    {
        return [
            'new_quantity' => ['required', 'integer', 'min:0'],
            'reason'       => ['required', 'string', 'min:5', 'max:500'],
        ];
    }
}
