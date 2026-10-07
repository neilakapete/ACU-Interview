<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMemberRequest;
use App\Models\Member;
use App\Models\MemberOnboardingStep;
use App\Models\OnboardingStep;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(Member::with('onboardingStepsProgress.onboardingStep')->orderBy('name', 'asc')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMemberRequest $request): JsonResponse
    {
        $member = DB::transaction(function () use ($request) {
            $member = Member::create($request->validated());
            $onboardingSteps = OnboardingStep::orderBy('sequence')->get();

            foreach ($onboardingSteps as $step) {
                MemberOnboardingStep::create([
                    'member_id' => $member->id,
                    'onboarding_step_id' => $step->id,
                    // Account Opened should always be the first step and should be completed
                    'completed_at' => ($step->sequence === 1)
                        ? now()->toDateString()
                        : null,
                ]);
            }

            return $member->load('onboardingStepsProgress.onboardingStep');
        });

        return response()->json($member, 201);
    }
}
