<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\InvitationController as AdminInvitationController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\StatsController;
use App\Http\Controllers\Admin\TemplateController as AdminTemplateController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TemplateController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public — unauthenticated
|--------------------------------------------------------------------------
*/

Route::apiResource('templates', TemplateController::class)->only(['index', 'show']);

Route::post('orders', [OrderController::class, 'store'])->middleware('throttle:orders');

Route::controller(PaymentController::class)->prefix('payment')->group(function () {
    Route::post('initiate', 'initiate')->middleware('throttle:orders');
    Route::get('success',  'success')->name('payment.success');
    Route::get('fail',     'fail')->name('payment.fail');
});

Route::controller(InvitationController::class)->prefix('invitations/{invitation}')->group(function () {
    Route::get('/',       'show');
    Route::post('view',   'incrementView');
    Route::post('extend', 'extend')->middleware('throttle:orders');
});

/*
|--------------------------------------------------------------------------
| Admin — Sanctum token required
|--------------------------------------------------------------------------
*/

Route::post('admin/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->prefix('admin')->name('admin.')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);

    Route::apiResource('orders',      AdminOrderController::class)->only(['index', 'show']);
    Route::apiResource('invitations', AdminInvitationController::class)->only(['index']);
    Route::apiResource('templates',   AdminTemplateController::class)->except(['show']);

    Route::put('invitations/{invitation}/extend', [AdminInvitationController::class, 'extend'])
        ->name('invitations.extend');

    Route::get('stats', [StatsController::class, 'index'])->name('stats');
});
