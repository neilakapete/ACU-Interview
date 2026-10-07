<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MemberOnboardingStep extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'onboarding_step_id',
        'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'date:Y-m-d',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function onboardingStep(): BelongsTo
    {
        return $this->belongsTo(OnboardingStep::class);
    }
}
