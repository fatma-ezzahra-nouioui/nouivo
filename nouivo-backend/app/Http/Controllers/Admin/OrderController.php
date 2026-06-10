<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orders) {}

    public function index(): AnonymousResourceCollection
    {
        return OrderResource::collection($this->orders->paginatedList());
    }

    public function show(Order $order): OrderResource
    {
        return new OrderResource($this->orders->detail($order));
    }
}
