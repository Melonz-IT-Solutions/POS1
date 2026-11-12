<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('edit users');
    }

    public function rules(): array
    {
        $user = $this->route('user');

        return [
            'name'   => ['required', 'string', 'max:150'],
            'email'  => ['required', 'email', 'max:150', Rule::unique('users', 'email')->ignore($user->id)],
            'role'   => ['required', 'string', 'exists:roles,name'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }
}
