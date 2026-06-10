<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Template extends Model
{
    public const CATEGORIES = [
        'wedding', 'birthday', 'engagement', 'circumcision',
        'eid', 'ramadan', 'corporate', 'business_card',
    ];

    protected $fillable = [
        'title',
        'category',
        'thumbnail_path',
        'component_name',
        'price',
        'text_fields',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'text_fields' => 'array',
        'is_active'   => 'boolean',
        'price'       => 'decimal:3',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }
}
