<?php

namespace App\Http\Controllers;

use App\Http\Resources\TemplateResource;
use App\Models\Template;
use App\Services\TemplateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TemplateController extends Controller
{
    public function __construct(private readonly TemplateService $templates) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $templates = $this->templates->catalog($request->query('category'));

        return TemplateResource::collection($templates);
    }

    public function show(Template $template): TemplateResource|JsonResponse
    {
        abort_if(! $template->is_active, 404);

        return new TemplateResource($template);
    }
}
