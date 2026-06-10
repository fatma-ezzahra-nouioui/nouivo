<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTemplateRequest;
use App\Http\Requests\Admin\UpdateTemplateRequest;
use App\Http\Resources\Admin\TemplateResource;
use App\Models\Template;
use App\Services\TemplateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TemplateController extends Controller
{
    public function __construct(private readonly TemplateService $templates) {}

    public function index(): AnonymousResourceCollection
    {
        return TemplateResource::collection($this->templates->allForAdmin());
    }

    public function store(StoreTemplateRequest $request): JsonResponse
    {
        $template = $this->templates->create($request->validated());

        return (new TemplateResource($template))->response()->setStatusCode(201);
    }

    public function update(UpdateTemplateRequest $request, Template $template): TemplateResource
    {
        return new TemplateResource($this->templates->update($template, $request->validated()));
    }

    public function destroy(Template $template): JsonResponse
    {
        $this->templates->deactivate($template);

        return response()->json(['message' => 'Template deactivated.']);
    }
}
