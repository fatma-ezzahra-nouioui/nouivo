<?php

namespace App\Services;

use App\Models\ExtensionPayment;
use App\Models\Invitation;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class InvitationService
{
    public function forPublicView(Invitation $invitation): Invitation
    {
        abort_if(! $invitation->is_active, 403, 'Invitation is no longer active.');
        abort_if($invitation->isExpired(), 410, 'Invitation has expired.');

        return $invitation->loadMissing(['order.template']);
    }

    public function incrementView(Invitation $invitation): int
    {
        $invitation->increment('view_count');

        return $invitation->view_count;
    }

    public function initiateExtension(Invitation $invitation): array
    {
        abort_if(! $invitation->is_active, 403, 'Invitation is no longer active.');

        // TODO: Call Konnect API and return real payment URL
        return [
            'invitation_id' => $invitation->id,
            'amount'        => config('app.extension_price'),
            'months'        => 3,
            'payment_url'   => null,
        ];
    }

    public function paginatedList(int $perPage = 25): LengthAwarePaginator
    {
        return Invitation::with([
            'order:id,buyer_name,buyer_email,template_id',
            'order.template:id,title,category',
        ])->latest()->paginate($perPage);
    }

    public function manualExtend(Invitation $invitation, int $months): Invitation
    {
        $base      = $invitation->isExpired() ? now() : $invitation->expires_at->copy();
        $newExpiry = $base->addMonths($months);

        DB::transaction(function () use ($invitation, $months, $newExpiry): void {
            $invitation->update(['expires_at' => $newExpiry]);

            ExtensionPayment::create([
                'invitation_id'      => $invitation->id,
                'amount_paid'        => 0,
                'konnect_payment_id' => null,
                'months_added'       => $months,
                'new_expires_at'     => $newExpiry,
            ]);
        });

        return $invitation->fresh();
    }
}
