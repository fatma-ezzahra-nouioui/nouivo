<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        $this->configureRateLimiting();
    }

    private function configureRateLimiting(): void
    {
        // Default API throttle (60 req/min per IP)
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->ip());
        });

        // Stricter limit for order creation, payment initiation, and extension requests
        RateLimiter::for('orders', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });
    }
}
