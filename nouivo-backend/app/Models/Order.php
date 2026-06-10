<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    protected $fillable = [
        'template_id',
        'buyer_name',
        'buyer_email',
        'buyer_phone',
        'custom_text',
        'amount_paid',
        'konnect_payment_id',
        'konnect_payment_ref',
        'status',
    ];

    protected $casts = [
        'custom_text'  => 'array',
        'amount_paid'  => 'decimal:3',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    public function invitation(): HasOne
    {
        return $this->hasOne(Invitation::class);
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }
}
