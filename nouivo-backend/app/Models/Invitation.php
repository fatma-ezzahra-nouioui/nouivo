<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invitation extends Model
{
    protected $fillable = [
        'order_id',
        'slug',
        'pdf_path',
        'expires_at',
        'view_count',
        'is_active',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_active'  => 'boolean',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function extensionPayments(): HasMany
    {
        return $this->hasMany(ExtensionPayment::class);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isAccessible(): bool
    {
        return $this->is_active && ! $this->isExpired();
    }
}
