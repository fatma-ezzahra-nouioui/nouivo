<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'buyer_name'  => $this->buyer_name,
            'buyer_email' => $this->buyer_email,
            'buyer_phone' => $this->buyer_phone,
            'amount_paid' => (float) $this->amount_paid,
            'status'      => $this->status,
            'created_at'  => $this->created_at->toIso8601String(),

            // Conditionally included when loaded
            'template'   => $this->whenLoaded('template', fn () => [
                'id'       => $this->template->id,
                'title'    => $this->template->title,
                'category' => $this->template->category,
            ]),
            'invitation' => $this->whenLoaded('invitation', fn () => $this->invitation ? [
                'id'         => $this->invitation->id,
                'slug'       => $this->invitation->slug,
                'expires_at' => $this->invitation->expires_at->toIso8601String(),
                'is_active'  => $this->invitation->is_active,
                'view_count' => $this->invitation->view_count,
            ] : null),
            'custom_text' => $this->when(
                $request->routeIs('admin.orders.show'),
                $this->custom_text
            ),
            'extension_payments' => $this->whenLoaded(
                'invitation',
                fn () => $this->invitation?->relationLoaded('extensionPayments')
                    ? $this->invitation->extensionPayments->map(fn ($ep) => [
                        'id'             => $ep->id,
                        'months_added'   => $ep->months_added,
                        'new_expires_at' => $ep->new_expires_at->toIso8601String(),
                        'amount_paid'    => (float) $ep->amount_paid,
                        'created_at'     => $ep->created_at->toIso8601String(),
                    ])
                    : null
            ),
        ];
    }
}
