<?php

namespace App\Services\Admin;

use App\Models\Invitation;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class StatsService
{
    public function dashboard(): array
    {
        // Single query per logical group — avoids multiple COUNT(*) round-trips
        $orders = Order::selectRaw('
            COUNT(*)                        AS total,
            SUM(status = "paid")            AS paid,
            SUM(status = "pending")         AS pending,
            SUM(status = "failed")          AS failed,
            SUM(CASE WHEN status = "paid" THEN amount_paid ELSE 0 END) AS revenue
        ')->first();

        $invitations = Invitation::selectRaw('
            SUM(is_active = 1 AND expires_at > NOW()) AS active,
            SUM(expires_at <= NOW())                  AS expired,
            COALESCE(SUM(view_count), 0)              AS total_views
        ')->first();

        $revenueByCategory = Order::where('status', 'paid')
            ->join('templates', 'orders.template_id', '=', 'templates.id')
            ->select('templates.category', DB::raw('SUM(orders.amount_paid) AS revenue'))
            ->groupBy('templates.category')
            ->pluck('revenue', 'category')
            ->map(fn ($v) => round((float) $v, 3));

        return [
            'orders' => [
                'total'   => (int) $orders->total,
                'paid'    => (int) $orders->paid,
                'pending' => (int) $orders->pending,
                'failed'  => (int) $orders->failed,
            ],
            'revenue' => [
                'total'       => round((float) $orders->revenue, 3),
                'by_category' => $revenueByCategory,
            ],
            'invitations' => [
                'active'      => (int) $invitations->active,
                'expired'     => (int) $invitations->expired,
                'total_views' => (int) $invitations->total_views,
            ],
        ];
    }
}
