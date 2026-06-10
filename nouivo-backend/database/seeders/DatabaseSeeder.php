<?php

namespace Database\Seeders;

use App\Models\Template;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Single admin account — credentials configurable via env
        User::firstOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@nouivo.com')],
            [
                'name'     => 'Admin',
                'password' => Hash::make(env('ADMIN_PASSWORD', 'password')),
            ]
        );

        // Sample templates
        $templates = [
            [
                'title'          => 'Golden Rose Wedding',
                'category'       => 'wedding',
                'thumbnail_path' => 'thumbnails/golden-rose-wedding.jpg',
                'component_name' => 'GoldenRoseWedding',
                'price'          => 29.900,
                'text_fields'    => [
                    'bride_name',
                    'groom_name',
                    'wedding_date',
                    'venue_name',
                    'venue_address',
                    'ceremony_time',
                    'reception_time',
                ],
                'is_active'  => true,
                'sort_order' => 1,
            ],
            [
                'title'          => 'Midnight Birthday Bash',
                'category'       => 'birthday',
                'thumbnail_path' => 'thumbnails/midnight-birthday.jpg',
                'component_name' => 'MidnightBirthday',
                'price'          => 19.900,
                'text_fields'    => [
                    'celebrant_name',
                    'age',
                    'party_date',
                    'party_time',
                    'venue_name',
                    'venue_address',
                    'rsvp_phone',
                ],
                'is_active'  => true,
                'sort_order' => 2,
            ],
            [
                'title'          => 'Business Card Pro',
                'category'       => 'business_card',
                'thumbnail_path' => 'thumbnails/business-card-pro.jpg',
                'component_name' => 'BusinessCardPro',
                'price'          => 14.900,
                'text_fields'    => [
                    'full_name',
                    'job_title',
                    'company_name',
                    'phone',
                    'email',
                    'website',
                    'address',
                ],
                'is_active'  => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($templates as $data) {
            Template::firstOrCreate(
                ['component_name' => $data['component_name']],
                $data
            );
        }
    }
}
