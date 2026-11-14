# Asah: full MVP web prototype — proposed plan

## Approval boundary
No application code, accounts, database, payment service, or age classification will be implemented until you explicitly approve this plan. Your updated decisions override the uploaded PRD where they differ.

**Confirmed requirements:** full MVP web prototype; accounts deferred; five Free replacements per child per WIB day; unlimited Pro replacements; free duration adjustments; one editable observation per completion occasion; concern scenarios are explicitly non-clinical demonstrations.

**Awaiting approval:** month-based boundaries, prototype data handling, simulated upgrade behavior, visual direction, and the recommendations below. Approval of the whole plan approves these proposals unless you identify exceptions.

## 1. Incorporating the developmental framework
Each child has one primary stage derived from their birth date. That stage organizes Today Activity suggestions, saved-content discovery, developmental guidance, and the focus areas shown in observation history. Switching children changes all child-specific content and history.

| Stage | Proposed exact range | Preserved development focus | Preserved theoretical foundation |
|---|---|---|---|
| 1 | Birth to before 4-month birthday: 0–3 completed months | Sensory awareness, bonding, tracking light/movement | Piaget — Sensorimotor (reflexes) |
| 2 | 4-month birthday to before 1st birthday: 4–11 completed months | Cause-effect, object permanence, gross motor development (rolling, sitting) | Piaget — Sensorimotor (primary circular reactions) |
| 3 | 1st birthday to before 2nd birthday: 12–23 completed months | Language acquisition, walking, beginnings of symbolic play | Vygotsky — Zone of Proximal Development (ZPD); Erikson — Autonomy vs. Shame |
| 4 | 2nd birthday to before 4th birthday: 24–47 completed months | Imaginative/pretend play, social interaction, fine motor development | Piaget — Preoperational; Montessori — Sensitive periods |
| 5 | 4th birthday to before 6th birthday: 48–71 completed months | Literacy readiness, problem-solving, emotional regulation | Erikson — Initiative vs. Guilt; Vygotsky — Scaffolding |

### Boundary proposal — explicit approval required
Use completed calendar months, not days divided by 30. At each boundary the child enters the older stage: 4, 12, 24, and 48 months. Thus the framework's “4–12 months” label becomes “4–11 months” in exact operational ranges, resolving the overlap at the first birthday. Interpret “4–5 years” as including the whole fifth year, ending at the sixth birthday; please modify this if you intend a cutoff at the fifth birthday.

For birth dates at the end of a month, use the last valid day in shorter months as the monthly anniversary. Determine the current date in Jakarta. Reject future birth dates; children aged six or older receive an out-of-range message rather than younger-child recommendations.

These are organizational ranges, not clinical cutoffs. Display the child's actual age and a plain stage label; do not imply that a stage transition is a deadline for development. Existing saved activities and observations retain their original age/stage context.

## 2. Information still unavailable
- The referenced AI Proposal, specific source editions/pages, pediatric reviewer attribution, approved milestones, and clinically verified BPJS/cost information are unavailable.
- Theory names establish the supplied framework; they do not validate an individual activity or an assessment.
- No real concern-detection rules exist. Observation responses must not produce actual assessments, scores, or concern flags.
- Pro pricing, payment handling, and paid feature entitlements beyond unlimited replacements are unspecified. This prototype will not invent them.
- The data budget and pilot usage baselines remain unmeasured. Measure prototype behavior without presenting invented targets as requirements.

**Proposed handling:** clearly label sample activities and guidance as unreviewed prototype content, show the supplied theory foundations, and mark clinical review as pending. Demonstrate the concern journey through an explicitly selected sample scenario, isolated from real observations. Show the structure of a referral note and BPJS sheet without invented clinical or cost advice. These limits prevent the prototype from being mistaken for a clinically approved product.

## 3. Recommendations for approval
These are proposals, not silently added PRD requirements.

| Area / Feature | Current PRD Approach | Suggested Improvement | Rationale | Priority |
|---|---|---|---|---|
| Age personalization | Five overlapping stage labels | Adopt the exact month ranges above and update the primary stage automatically | Every child maps to one stage without gaps | High |
| Activity recommendations | Generated, age-fitted activities | Use a small curated sample library per stage and duration; no live AI in the prototype | Predictable safety checks without unsupported validation claims | High |
| Developmental tracking | Basic on-track view from norms and logs | Show activities tried and caregiver responses by the supplied focus areas; no inferred developmental status | Useful history without inventing assessment thresholds | High |
| Daily choice | Duration choices and replacements | Keep the current activity on reopen; show a subtle remaining-allowance counter | Reduces repetitive decisions | Medium |
| Offline | Read Today, saved activities and guidance offline | Indicate offline availability and save prototype observations on the device | Predictable behavior with intermittent connectivity | High |
| Sharing | WhatsApp image plus short text | Omit child details from activity shares by default; provide image download and text fallback | Privacy and realistic browser support | High |
| Concern note | Shareable/printable note | Preview and confirm included details; visibly label sample scenarios | Prevents accidental disclosure or misleading medical notes | High |

## 4. Platform structure and visual direction
Build the usable experience at `/`, not a marketing landing page. All user-facing copy is plain, caregiver-inclusive Bahasa Indonesia.

- **Onboarding:** at most three screens for consent/transparency, birth date and optional nickname, caregiver role. A sample-profile option lets the prototype be explored without real child data.
- **Hari ini:** child switcher, actual age/stage, 1/5/10-minute choice, today's suggestion, remaining replacements, activity details, completion, save, share, and report-content controls.
- **Tersimpan:** saved activities, details and offline availability.
- **Perkembangan:** stage guidance, supplied foundations and focus areas, observation summary, and clearly separated sample concern journey.
- **Riwayat:** weekly completed-activity history; edit each completion's response independently.
- **Pengaturan:** add/edit/remove children, prototype Free/Pro state, transparency, consent/data controls, and clear all device data.
- **Concern journey:** sample notification → calm next step → note preview → print/share; sample referral/BPJS information remains visibly unverified.
- **Transparency:** who is behind Asah (not supplied, so not invented), sources/framework, review status, AI limitations, and device-data handling; reachable from onboarding and settings.

Proposed direction: bright neutral canvas, leafy green primary actions, restrained coral and pale yellow accents, friendly readable sans-serif type, small activity illustrations, and generous readable spacing. Use bottom navigation on phones and persistent navigation on larger screens. No scores, streaks, guilt language, alarming colors, or decorative marketing sections.

## 5. End-to-end flows and interaction rules
### Daily play
Choose/create a child → land on Today Activity → choose duration → read materials, steps, speech prompts and safety notes → complete activity → tap **Ya / Sedikit / Belum** → view that completion in weekly history and developmental focus summaries.

Every activity includes all seven PRD fields. Under-three activities include speech prompts, supervision and mouthing/choking notes, and exclude small items. Activities fit ordinary home spaces and household materials. A local content-report action confirms receipt within the prototype but explicitly does not claim submission to a real team.

### Replacements and Pro demonstration
- Initial daily suggestion does not count as a replacement.
- Free: five successful replacements per child per Jakarta calendar day; counter starts at five remaining. Children have independent counters.
- Reset at midnight WIB, including when reopening the app; changing the device's timezone does not change the calendar basis.
- Changing between 1, 5 and 10 minutes does not consume allowance.
- At five used, disable further replacements and show a dismissible upgrade prompt. Dismissing leaves completion, duration changes, saving and sharing available.
- **Upgrade to Pro** opens a clearly labelled simulated upgrade screen, with no price, payment, or real subscription. Proposed confirmation switches this device's prototype to Pro, where replacements are unlimited. Settings allow returning to Free; today's previously used Free allowance remains recorded.
- Use the localized equivalent of “3 of 5 replacements remaining today.” Unlimited means no quota, not an infinite content library; avoid immediate repeats when alternatives exist.

### Completion history
Each completed occasion gets its own record and timestamp, even for a repeated activity. Each record has one editable response. Editing updates the existing record rather than creating a second completion.

### Sharing and concern demonstration
Use system file sharing where supported, including WhatsApp when available. Browsers cannot guarantee direct WhatsApp image attachment: offer image download and a WhatsApp text link as fallback. Activity shares are readable without Asah installed. Printable notes include only caregiver-confirmed details and remain labelled as demonstrations when sourced from a sample scenario.

## 6. Data approach and technical details
**Proposed prototype exception:** no Lovable Cloud, real authentication, real subscription, external AI, or production analytics. Use browser-device storage for profiles, daily selections, replacement counts, completion records, saved cards, and simulated plan state. Explain that data stays on this browser/device, is not synced or recoverable elsewhere, and can be cleared. Encourage fictional profiles; do not claim UU PDP compliance based on a prototype alone.

Use an installable web-app shell and offline cache for the application, Today Activity, saved activities, and stage guidance after the first online load. Keep assets small and text-first. Offline sharing still requires the chosen external service to reconnect. Browser storage can be cleared or evicted and device clocks can be altered; this is not production-grade quota enforcement.

Use the existing TanStack Start routing and design-system controls. Keep classification, Jakarta-day quotas, and completion-record logic in small testable modules. Catalog fields include stage, focus, duration variants, materials, steps, observations, safety notes, speech prompts, framework attribution, and unreviewed status. Completion records retain the activity version and child's stage at completion.

Separate developmental observations from sample concern scenarios structurally so real entries cannot trigger demonstrations accidentally. Every content page receives its own Asah-specific title and description. Do not collect extra signup data or attach child details to routine activity shares.

## 7. Implementation sequence after approval
1. Define tokens, shared controls, exact approved age rules, sample catalog, and test fixtures.
2. Build onboarding, multi-child switching and settings/data controls.
3. Implement Today Activity, duration variants, replacement counters, midnight reset, and simulated Pro flow.
4. Add completion records, editing, weekly history and non-assessment developmental summaries.
5. Add saved/offline content, image/text sharing, content-report demonstration and printable note previews.
6. Add transparent sample concern scenarios and review-pending content pages.
7. Verify the full mobile and desktop journeys, offline reload, share fallbacks, and empty/error/success states.

## 8. Acceptance checks
- Boundary tests at 4, 12, 24, 48, and 72 months, including month-end dates and future birth dates.
- Free blocks the sixth replacement, resets at midnight WIB, and keeps child counters independent; Pro is unlimited.
- Duration changes leave quota unchanged; dismissing the prompt preserves existing-activity actions.
- Repeat completions create separate records; edits modify only the selected occasion.
- All sample activities contain seven required fields, stay in their stage, and satisfy encoded under-three material and speech-prompt rules; passing tests is not clinical validation.
- Offline app reload reads cached Today, saved cards and guidance after initial online use.
- Actual observations never generate clinical assessments or sample concern flags.
- Confirm onboarding → activity → completion → history edit → share → sample concern → note preview/print end to end.

## Exclusions and launch gates
No native Android package, actual accounts, cross-device sync, live AI generation, chatbot, payments, real referral submission, paid reports, expert booking, or other excluded PRD features. Clinical content/reviewer sign-off, real referral guidance, production privacy review, secure server-side quotas, and a measured data budget are prerequisites for a real pilot, not claims this prototype will make.

## Approval request
I've reviewed the PRD, identified the open questions, and proposed improvements and an implementation plan. Are you happy with this direction? Which suggestions would you like to approve, reject, or modify before I start building?

Please explicitly approve or modify the proposed month boundaries (especially the 48–71-month final stage), recommendations, device-only prototype storage, and simulated Pro upgrade. No implementation has started.