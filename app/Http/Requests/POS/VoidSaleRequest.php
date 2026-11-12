<?php

namespace App\Http\Requests\POS;

use Illuminate\Foundation\Http\FormRequest;

class VoidSaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Policy check done in controller
    }

    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'min:5', 'max:500'],
        ];
    }
}
