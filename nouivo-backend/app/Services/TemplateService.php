<?php

namespace App\Services;

use App\Models\Template;
use Illuminate\Database\Eloquent\Collection;

class TemplateService
{
    public function catalog(?string $category): Collection
    {
        return Template::active()
            ->when($category, fn ($q) => $q->where('category', $category))
            ->get();
    }

    public function allForAdmin(): Collection
    {
        return Template::orderBy('sort_order')->get();
    }

    public function create(array $data): Template
    {
        return Template::create($data);
    }

    public function update(Template $template, array $data): Template
    {
        $template->update($data);

        return $template->fresh();
    }

    public function deactivate(Template $template): void
    {
        $template->update(['is_active' => false]);
    }
}
