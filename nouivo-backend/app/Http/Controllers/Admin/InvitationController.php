<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ExtendInvitationRequest;
use App\Http\Resources\Admin\InvitationResource;
use App\Models\Invitation;
use App\Services\InvitationService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class InvitationController extends Controller
{
    public function __construct(private readonly InvitationService $invitations) {}

    public function index(): AnonymousResourceCollection
    {
        return InvitationResource::collection($this->invitations->paginatedList());
    }

    public function extend(ExtendInvitationRequest $request, Invitation $invitation): InvitationResource
    {
        $invitation = $this->invitations->manualExtend($invitation, $request->integer('months'));

        return new InvitationResource($invitation);
    }
}
