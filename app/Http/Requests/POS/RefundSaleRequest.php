<?php

namespace App\Http\Requests\POS;

use Illuminate\Foundation\Http\FormRequest;

class RefundSaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Policy check done in controller
    }

    public function rules(): array
    {
        return [
            'reason'              => ['required', 'string', 'min:5', 'max:500'],
            'items'               => ['required', 'array', 'min:1'],
            'items.*.sale_item_id'=> ['required', 'integer', 'exists:sale_items,id'],
            'items.*.quantity'    => ['required', 'integer', 'min:1'],
        ];
    }
}
