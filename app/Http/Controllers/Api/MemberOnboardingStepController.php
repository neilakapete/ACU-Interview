<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateMemberOnboardingStepRequest;
use App\Models\MemberOnboardingStep;
use Illuminate\Http\JsonResponse;

class MemberOnboardingStepController extends Controller
{
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMemberOnboardingStepRequest $request, MemberOnboardingStep $memberOnboardingStep): JsonResponse
    {
        $memberOnboardingStep->update([
            'completed_at' => $request->validated('completed_at'),
        ]);

        return response()->json($memberOnboardingStep);
    }
}
