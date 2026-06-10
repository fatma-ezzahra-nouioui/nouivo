<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Template;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function create(array $data, Template $template): Order
    {
        $missing = array_diff(
            $template->text_fields ?? [],
            array_keys($data['custom_text'] ?? [])
        );

        if (! empty($missing)) {
            throw ValidationException::withMessages([
                'custom_text' => ['Missing required invitation fields: ' . implode(', ', array_values($missing))],
            ]);
        }

        return Order::create([
            'template_id' => $template->id,
            'buyer_name'  => $data['buyer_name'],
            'buyer_email' => $data['buyer_email'],
            'buyer_phone' => $data['buyer_phone'],
            'custom_text' => $data['custom_text'],
            'amount_paid' => $template->price,
            'status'      => 'pending',
        ]);
    }

    public function paginatedList(int $perPage = 25): LengthAwarePaginator
    {
        return Order::with([
            'template:id,title,category',
            'invitation:id,order_id,slug,expires_at,is_active',
        ])->latest()->paginate($perPage);
    }

    public function detail(Order $order): Order
    {
        return $order->loadMissing(['template', 'invitation.extensionPayments']);
    }
}
