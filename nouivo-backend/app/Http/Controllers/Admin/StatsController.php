<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\StatsService;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    public function __construct(private readonly StatsService $stats) {}

    public function index(): JsonResponse
    {
        return response()->json($this->stats->dashboard());
    }
}
