<?php

namespace App\Http\Requests\Admin;

use App\Models\Template;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'          => ['required', 'string', 'max:255'],
            'category'       => ['required', Rule::in(Template::CATEGORIES)],
            'thumbnail_path' => ['required', 'string', 'max:500'],
            'component_name' => ['required', 'string', 'max:100', 'unique:templates,component_name', 'alpha_dash'],
            'price'          => ['required', 'numeric', 'min:0', 'max:9999.999'],
            'text_fields'    => ['required', 'array', 'min:1'],
            'text_fields.*'  => ['required', 'string', 'max:100', 'alpha_dash'],
            'is_active'      => ['boolean'],
            'sort_order'     => ['integer', 'min:0'],
        ];
    }
}
