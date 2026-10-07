# Solution: New Member Journey Tracker

## What I built
A page where branch staff can see every new member's onboarding progress at a glance.
- Table of members with a progress chip (for example 2/4 In Progress) and one column per onboarding step
- Create Member dialog
- A shared date dialog to record when a step was completed, and a cancel icon to clear it

## Key decisions
- **Transactional member creation.** Creating a member also creates one progress row per onboarding step, inside a database transaction, so a member never ends up with partial steps.
- **"Account Opened" is completed on creation**, since a member who exists has an open account.
- **Ordering lives in the backend.** Steps and each member's progress are ordered by `sequence`, and the frontend relies on that order. A test covers it using deliberately out-of-order seed data
- **Validation is enforced on the server** (required fields, unique email, max length, `YYYY-MM-DD` dates, no future dates, `completed_at` must be sent explicitly). The client trims input, blocks future dates in the calendar, and shows server errors under the fields.
- **Product conversations are one milestone.** Whether any individual product conversation (TFSA, FHSA, overdraft protection) should be required needs further analysis, since eligibility varies by member.

## Tradeoffs (deliberate)
- No authentication or audit trail: there is no record of who completed or cleared a step, or when. A financial institution would need full audit logging of these actions.
- No pagination or server-side filtering
- No "not applicable" state for steps
- The Tasks API and seeders are left in place

## Testing
Feature tests cover the API, validation rules, the set and clear state changes, the "Account Opened" auto-completion, and ordering by sequence.

## Possible next steps
1. Stalled-member signal - flag members with incomplete steps more than X days after joining (member `created_at` already supports this)
2. Status filter (Not Started, In Progress, Completed)
3. Notes or sub-items on the product conversation step, plus a "not applicable" state
4. Undo after clearing a date so the original date isn't lost
5. Pagination and server-side filtering for scale
