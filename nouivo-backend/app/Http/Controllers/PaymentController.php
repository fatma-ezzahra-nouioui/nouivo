<?php

namespace App\Http\Controllers;

use App\Http\Requests\InitiatePaymentRequest;
use App\Models\Order;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(private readonly PaymentService $payments) {}

    public function initiate(InitiatePaymentRequest $request): JsonResponse
    {
        $order       = Order::findOrFail($request->integer('order_id'));
        $paymentUrl  = $this->payments->initiate($order);

        return response()->json(['payment_url' => $paymentUrl]);
    }

    public function success(Request $request): RedirectResponse
    {
        $paymentRef   = $request->query('payment_ref', '');
        $frontendBase = rtrim(config('app.frontend_url'), '/');

        if (empty($paymentRef)) {
            return redirect("{$frontendBase}/payment/fail");
        }

        $invitation = $this->payments->handleSuccess($paymentRef);

        return redirect("{$frontendBase}/payment/success?slug={$invitation->slug}");
    }

    public function fail(): RedirectResponse
    {
        return redirect(rtrim(config('app.frontend_url'), '/') . '/payment/fail');
    }
}
