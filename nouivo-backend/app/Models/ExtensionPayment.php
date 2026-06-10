<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExtensionPayment extends Model
{
    protected $fillable = [
        'invitation_id',
        'amount_paid',
        'konnect_payment_id',
        'months_added',
        'new_expires_at',
    ];

    protected $casts = [
        'amount_paid'    => 'decimal:3',
        'new_expires_at' => 'datetime',
    ];

    public function invitation(): BelongsTo
    {
        return $this->belongsTo(Invitation::class);
    }
}
