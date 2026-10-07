<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OnboardingStep;

class OnboardingStepsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(OnboardingStep::orderBy('sequence', 'asc')->get());
    }
}
