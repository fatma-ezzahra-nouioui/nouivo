<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TemplateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'title'          => $this->title,
            'category'       => $this->category,
            'thumbnail_path' => $this->thumbnail_path,
            'component_name' => $this->component_name,
            'price'          => (float) $this->price,
            'text_fields'    => $this->text_fields,
            'is_active'      => $this->is_active,
            'sort_order'     => $this->sort_order,
            'created_at'     => $this->created_at->toIso8601String(),
            'updated_at'     => $this->updated_at->toIso8601String(),
        ];
    }
}
