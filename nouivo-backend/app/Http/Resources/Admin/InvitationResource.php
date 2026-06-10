<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvitationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'slug'       => $this->slug,
            'expires_at' => $this->expires_at->toIso8601String(),
            'is_active'  => $this->is_active,
            'is_expired' => $this->isExpired(),
            'view_count' => $this->view_count,
            'pdf_path'   => $this->pdf_path,
            'created_at' => $this->created_at->toIso8601String(),

            'order' => $this->whenLoaded('order', fn () => [
                'id'          => $this->order->id,
                'buyer_name'  => $this->order->buyer_name,
                'buyer_email' => $this->order->buyer_email,
                'template'    => $this->order->relationLoaded('template') ? [
                    'id'       => $this->order->template->id,
                    'title'    => $this->order->template->title,
                    'category' => $this->order->template->category,
                ] : null,
            ]),
            'extension_payments' => $this->whenLoaded('extensionPayments', fn () =>
                $this->extensionPayments->map(fn ($ep) => [
                    'id'             => $ep->id,
                    'months_added'   => $ep->months_added,
                    'new_expires_at' => $ep->new_expires_at->toIso8601String(),
                    'amount_paid'    => (float) $ep->amount_paid,
                    'created_at'     => $ep->created_at->toIso8601String(),
                ])
            ),
        ];
    }
}
