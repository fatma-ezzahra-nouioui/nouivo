<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvitationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug'           => $this->slug,
            'expires_at'     => $this->expires_at->toIso8601String(),
            'component_name' => $this->order->template->component_name,
            'category'       => $this->order->template->category,
            'custom_text'    => $this->order->custom_text,
            'view_count'     => $this->view_count,
        ];
    }
}
