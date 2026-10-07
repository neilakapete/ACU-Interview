<?php

use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\MemberOnboardingStepController;
use App\Http\Controllers\Api\OnboardingStepsController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

Route::apiResource('tasks', TaskController::class);
Route::apiResource('members', MemberController::class)->only(['index', 'store']);
Route::apiResource('member-onboarding-steps', MemberOnboardingStepController::class)->only('update');
Route::apiResource('onboarding-steps', OnboardingStepsController::class)->only('index');
