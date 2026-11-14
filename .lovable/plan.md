# Onboarding flow and UX proposal

## Audit findings

- **The developmental journey is duplicated.** Step 1 shows a generic introduction plus all five stage cards. Step 4 shows the same five cards again, this time with the child's current stage highlighted. This creates a long, repetitive flow.
- **The role can be asked twice.** The role screen visually defaults to “Ibu / Mother,” but continuing without changing the dropdown does not save that value. The child form then thinks no role exists and shows “I am the…” again.
- **Theory requires unnecessary taps.** Every stage hides its theoretical foundation behind a separate button; all five explanations start collapsed.
- **Progress needs migration before reordering.** Interrupted setups currently store only step numbers 1–6. Changing the order without mapping those numbers would resume people on the wrong screen.

## Proposed flow

Reduce the journey from six stages to five, with four interactive setup screens followed by the homepage:

```text
1. Caregiver role
2. Child details
3. Personalized play and development introduction
4. Household items (optional)
5. Homepage
```

This removes the repeated generic introduction and the unused “All set” interstitial. Saving or skipping household items goes directly to the homepage.

## Experience changes

### 1. Start with the caregiver role
- Keep the existing account-level role choices and visual style.
- Save the displayed selection when continuing, even if the parent leaves the default unchanged.
- Ask this once per family space; role editing remains in Settings.

### 2. Collect only child details next
- Keep nickname, birth date, consent, sample-profile option, and existing validation.
- Do not render a role field in the onboarding child form; use the role already saved in step 1.
- Preserve the current behavior for adding or editing children elsewhere.

### 3. Combine the introduction and personalized journey
- Move “Why play matters” after child details and personalize it with the child's name.
- Show the five-stage journey only once, with the child's current stage clearly highlighted.
- Keep the five approved age ranges, focus areas, play guidance, and non-clinical framing unchanged.
- Retain Back/Next navigation and update the progress indicator and labels in English and Indonesian.

### 4. Make theory visible and approachable
- Add a short, plain-language theory explanation directly inside each onboarding stage card, alongside the existing theory name.
- Remove onboarding's expand/collapse theory buttons; no extra tap is required.
- Keep the explanation concise and add both English and Indonesian strings.
- Scope this presentation change to onboarding so the existing Development page is not altered.

### 5. Keep household setup unchanged
- Preserve the shared inventory, explicit substitutes, custom items, skip behavior, and material-free recommendation rules.
- Use the existing cards, typography, colors, spacing, and Android-inspired styling throughout.

## Preserving existing data and progress

- Add a versioned onboarding-flow migration before rendering an interrupted setup.
- Leave completed family spaces, child profiles, observations, saved activities, inventory, and selected roles untouched.
- Map old progress as follows:
  - Old steps 1–2 → new role step 1.
  - Old step 3 → new child step 2 when a role exists; otherwise role step 1.
  - Old step 4 → new personalized introduction step 3.
  - Old step 5 → new household step 4.
- Carry the existing child draft and household draft forward unchanged. If an interrupted space has no saved role because of the current bug, ask for the role once without erasing those drafts.
- Ensure refresh, sign out/sign in, and reopening the browser resume at the mapped step.

## Technical notes

- Update `Onboarding.tsx` for the new sequence and single journey render.
- Add an onboarding-only inline-theory presentation to `DevelopmentJourney.tsx`.
- Add a pure migration/helper in `account.ts`; make the store use the shared step-count constant rather than a hardcoded six.
- Keep stored roles, child IDs, inventory IDs, and dates language-independent.

## Validation

- Add rule tests for every old-step mapping, role preservation, draft preservation, new step limits, and completed-space behavior.
- Verify in English and Indonesian: default and changed roles persist, no role field appears on the child step, theory is visible without clicking, and only one journey appears.
- Verify Back, refresh/resume, sign out/sign in, inventory skip/save, and direct arrival on the homepage.
- Check the current mobile viewport and desktop for overflow, run the full test suite, and confirm the preview has no console or build errors.
