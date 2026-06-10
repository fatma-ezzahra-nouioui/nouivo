<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orders) {}

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = $this->orders->create($request->validated(), $request->template());

        return response()->json([
            'order_id' => $order->id,
            'amount'   => (float) $order->amount_paid,
        ], 201);
    }
}
