<?php

namespace App\Services;

use App\Models\Invitation;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentService
{
    /**
     * Initiate a Konnect payment session for a pending order.
     * Returns the Konnect checkout URL.
     *
     * TODO: Replace stub with real KonnectService call.
     */
    public function initiate(Order $order): string
    {
        abort_if($order->status !== 'pending', 422, 'Order is not in a payable state.');

        // $result = app(KonnectService::class)->initPayment($order);
        // $order->update(['konnect_payment_id' => $result['payment_id']]);
        // return $result['payment_url'];

        throw new \RuntimeException('Konnect integration not yet implemented.');
    }

    /**
     * Verify a Konnect callback, mark the order paid, and create the invitation.
     * Wrapped in a transaction — if PDF/email dispatch fails the order stays paid
     * and the jobs can be retried independently.
     *
     * TODO: Replace verification stub with real KonnectService call.
     */
    public function handleSuccess(string $paymentRef): Invitation
    {
        // TODO: verify with Konnect before trusting payment_ref
        // $verified = app(KonnectService::class)->verify($paymentRef);
        // abort_unless($verified['success'], 400, 'Payment verification failed.');

        $order = Order::where('konnect_payment_ref', $paymentRef)
            ->where('status', 'pending')
            ->firstOrFail();

        return DB::transaction(function () use ($order, $paymentRef): Invitation {
            $order->update([
                'status'              => 'paid',
                'konnect_payment_ref' => $paymentRef,
            ]);

            $invitation = Invitation::create([
                'order_id'   => $order->id,
                'slug'       => $this->uniqueSlug(),
                'expires_at' => now()->addMonths(3),
            ]);

            // TODO: dispatch(new GeneratePdfJob($invitation));
            // TODO: Mail::to($order->buyer_email)->send(new InvitationReadyMail($order, $invitation));

            return $invitation;
        });
    }

    private function uniqueSlug(): string
    {
        do {
            $slug = Str::lower(Str::random(8));
        } while (Invitation::where('slug', $slug)->exists());

        return $slug;
    }
}
