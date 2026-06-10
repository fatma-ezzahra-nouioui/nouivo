<?php

namespace App\Http\Controllers;

use App\Http\Resources\InvitationResource;
use App\Models\Invitation;
use App\Services\InvitationService;
use Illuminate\Http\JsonResponse;

class InvitationController extends Controller
{
    public function __construct(private readonly InvitationService $invitations) {}

    public function show(Invitation $invitation): InvitationResource
    {
        $invitation = $this->invitations->forPublicView($invitation);

        return new InvitationResource($invitation);
    }

    public function incrementView(Invitation $invitation): JsonResponse
    {
        $count = $this->invitations->incrementView($invitation);

        return response()->json(['view_count' => $count]);
    }

    public function extend(Invitation $invitation): JsonResponse
    {
        $result = $this->invitations->initiateExtension($invitation);

        return response()->json($result);
    }
}
