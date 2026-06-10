<?php

namespace App\Http\Requests\Admin;

use App\Models\Template;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $templateId = $this->route('template')->id;

        return [
            'title'          => ['sometimes', 'string', 'max:255'],
            'category'       => ['sometimes', Rule::in(Template::CATEGORIES)],
            'thumbnail_path' => ['sometimes', 'string', 'max:500'],
            'component_name' => ['sometimes', 'string', 'max:100', 'alpha_dash', Rule::unique('templates', 'component_name')->ignore($templateId)],
            'price'          => ['sometimes', 'numeric', 'min:0', 'max:9999.999'],
            'text_fields'    => ['sometimes', 'array', 'min:1'],
            'text_fields.*'  => ['required_with:text_fields', 'string', 'max:100', 'alpha_dash'],
            'is_active'      => ['sometimes', 'boolean'],
            'sort_order'     => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
