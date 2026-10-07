<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
    ];

    public function onboardingStepsProgress(): HasMany
    {
        return $this->hasMany(MemberOnboardingStep::class)
            ->join(
                'onboarding_steps',
                'member_onboarding_steps.onboarding_step_id',
                '=',
                'onboarding_steps.id'
            )
            ->orderBy('onboarding_steps.sequence', 'asc')
            ->select('member_onboarding_steps.*');
    }
}
