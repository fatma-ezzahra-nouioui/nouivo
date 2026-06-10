<?php

namespace App\Http\Requests;

use App\Models\Template;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'template_id'   => ['required', 'integer', Rule::exists('templates', 'id')->where('is_active', true)],
            'buyer_name'    => ['required', 'string', 'max:255'],
            'buyer_email'   => ['required', 'email:rfc', 'max:255'],
            'buyer_phone'   => ['required', 'string', 'regex:/^\+?[0-9\s\-]{7,20}$/'],
            'custom_text'   => ['required', 'array'],
            'custom_text.*' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function template(): Template
    {
        return Template::findOrFail($this->integer('template_id'));
    }
}
