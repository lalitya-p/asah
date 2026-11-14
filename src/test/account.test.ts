import { describe, expect, it } from 'vitest';
import {
  addChild,
  confirmReconcile,
  createAccount,
  destinationFor,
  finishOnboarding,
  hasOnboardingEvidence,
  migrateLegacy,
  migrateOnboarding,
  newOnboarding,
  patchOnboarding,
  roleForOnboarding,
  reconcileSummary,
  type Account,
} from '@/lib/account';
import { emptyState, type AppState, type Child } from '@/lib/asah';

const nara: Child = { id: 'child-nara', name: 'Nara', dob: '2023-04-01' };
const kini: Child = { id: 'child-kini', name: 'Kini', dob: '2025-01-01' };
const now = new Date('2026-11-14T04:00:00Z');

function space(overrides: Partial<AppState> = {}): AppState {
  return {
    ...emptyState,
    children: [nara],
    selected: nara.id,
    consent: true,
    role: 'Ibu',
    ...overrides,
  };
}

function account(data: AppState, onboarding = newOnboarding(), needsReconcile = false): Account {
  return { id: 'a1', name: 'Keluarga', createdAt: '2026-11-14T00:00:00Z', needsReconcile, onboarding, data };
}

describe('Onboarding evidence', () => {
  it('counts children plus consent as proof the introduction was seen', () => {
    expect(hasOnboardingEvidence(space())).toBe(true);
  });

  it('treats a space with no child as unfinished', () => {
    expect(hasOnboardingEvidence(space({ children: [], selected: '' }))).toBe(false);
  });

  it('treats child data without consent as unfinished', () => {
    expect(hasOnboardingEvidence(space({ consent: false }))).toBe(false);
  });
});

describe('Legacy migration', () => {
  it('adopts the old blob as one space that must be confirmed first', () => {
    const adopted = migrateLegacy(space(), 'legacy-1', '2026-11-14T00:00:00Z');
    expect(adopted.needsReconcile).toBe(true);
    expect(adopted.name).toBe('Nara');
    expect(adopted.data.children).toEqual([nara]);
    expect(adopted.data.role).toBe('Ibu');
    expect(adopted.onboarding.status).toBe('complete');
  });

  it('never marks partial data complete', () => {
    const adopted = migrateLegacy(space({ consent: false }), 'legacy-2', '2026-11-14T00:00:00Z');
    expect(adopted.onboarding.status).toBe('in-progress');
    expect(adopted.onboarding.step).toBe(1);
  });

  it('names a childless space Asah', () => {
    expect(migrateLegacy(space({ children: [], selected: '' }), 'legacy-3', 'now').name).toBe('Asah');
  });

  it('keeps two spaces from sharing one record container', () => {
    const first = createAccount('Satu', 'a1', '2026-11-14T00:00:00Z');
    const second = createAccount('Dua', 'a2', '2026-11-14T00:00:00Z');
    first.data.days['x'] = { day: '2026-11-14', used: 3, choice: 1, duration: 5 };
    expect(second.data.days).toEqual({});
    expect(second.data.logs).toEqual([]);
  });
});

describe('One-time confirmation', () => {
  it('finishes onboarding once the person confirms complete data', () => {
    const confirmed = confirmReconcile(account(space(), newOnboarding(), true));
    expect(confirmed.needsReconcile).toBe(false);
    expect(confirmed.onboarding.status).toBe('complete');
  });

  it('keeps incomplete data in onboarding after confirming', () => {
    const confirmed = confirmReconcile(account(space({ children: [], selected: '', consent: false }), newOnboarding(), true));
    expect(confirmed.needsReconcile).toBe(false);
    expect(confirmed.onboarding.status).toBe('in-progress');
    expect(confirmed.onboarding.step).toBe(1);
  });

  it('lists what was found before anything is used', () => {
    const summary = reconcileSummary(
      space({ logs: [{ id: 'l1', childId: nara.id, activityId: 'a', title: 't', focus: 'f', stage: 2, duration: 5, at: now.toISOString(), response: 'Ya' }], saved: [{ activityId: 'a', childId: nara.id, stage: 2, duration: 5 }], inventory: { status: 'complete', items: [{ id: 'rice', quantity: 2 }] } }),
      now,
    );
    expect(summary.children).toEqual([{ name: 'Nara', months: 43 }]);
    expect(summary.logs).toBe(1);
    expect(summary.saved).toBe(1);
    expect(summary.items).toBe(1);
    expect(summary.evidence).toBe(true);
  });
});

describe('Destination rule', () => {
  it('shows the boot screen until storage is read', () => {
    expect(destinationFor({ ready: false, account: null })).toBe('boot');
  });

  it('sends a signed-out person to welcome', () => {
    expect(destinationFor({ ready: true, account: null })).toBe('welcome');
  });

  it('asks for confirmation before anything else', () => {
    expect(destinationFor({ ready: true, account: account(space(), newOnboarding(), true) })).toBe('reconcile');
  });

  it('resumes onboarding while it is unfinished', () => {
    expect(destinationFor({ ready: true, account: account(space(), { ...newOnboarding(), step: 4 }) })).toBe('onboarding');
  });

  it('sends a finished space with a child to the app', () => {
    expect(
      destinationFor({
        ready: true,
        account: account(space(), { status: 'complete', step: 5, draftChild: null, draftItems: [], flowVersion: 2 }),
      }),
    ).toBe('app');
  });

  it('sends a finished space with no child to child setup, not onboarding', () => {
    expect(
      destinationFor({
        ready: true,
        account: account(
          space({ children: [], selected: '' }),
          { status: 'complete', step: 5, draftChild: null, draftItems: [], flowVersion: 2 },
        ),
      }),
    ).toBe('setup-child');
  });
});

describe('Finishing onboarding', () => {
  it('saves the child, selects it, and marks the inventory complete', () => {
    const done = finishOnboarding(account(space({ children: [], selected: '', consent: false })), nara, [{ id: 'rice', quantity: 1 }], false);
    expect(done.data.children).toEqual([nara]);
    expect(done.data.selected).toBe(nara.id);
    expect(done.data.consent).toBe(true);
    expect(done.data.inventory).toEqual({ status: 'complete', items: [{ id: 'rice', quantity: 1 }] });
    expect(done.onboarding.status).toBe('complete');
  });

  it('records a skipped inventory as skipped so only material-free play shows', () => {
    const done = finishOnboarding(account(space({ children: [], selected: '', consent: false })), nara, [], true);
    expect(done.data.inventory).toEqual({ status: 'skipped', items: [] });
    expect(done.onboarding.status).toBe('complete');
  });

  it('does not add the same child twice when resuming', () => {
    const done = finishOnboarding(account(space()), nara, [], true);
    expect(done.data.children).toEqual([nara]);
  });
});

describe('Adding another child', () => {
  it('keeps onboarding complete and reuses the account role and inventory', () => {
    const base = account(space({ inventory: { status: 'complete', items: [{ id: 'rice', quantity: 1 }] } }), {
      status: 'complete',
      step: 5,
      draftChild: null,
      draftItems: [],
      flowVersion: 2,
    });
    const withTwo = addChild(base, kini);
    expect(withTwo.data.children.map(child => child.id)).toEqual(['child-nara', 'child-kini']);
    expect(withTwo.data.selected).toBe('child-kini');
    expect(withTwo.data.role).toBe('Ibu');
    expect(withTwo.data.inventory.items).toHaveLength(1);
    expect(withTwo.onboarding.status).toBe('complete');
  });
});

describe('Onboarding flow migration', () => {
  const draftItems = [{ id: 'rice', quantity: 1 }];
  function legacyAccount(step: number, role = 'Ibu'): Account {
    return account(space({ children: [], selected: '', role }), {
      status: 'in-progress',
      step,
      draftChild: nara,
      draftItems,
      flowVersion: 1,
    });
  }

  it.each([
    [1, 1],
    [2, 1],
    [3, 2],
    [4, 3],
    [5, 4],
  ])('maps old step %i to new step %i without losing drafts or role', (oldStep, newStep) => {
    const migrated = migrateOnboarding(legacyAccount(oldStep, 'Ayah'));
    expect(migrated.onboarding.step).toBe(newStep);
    expect(migrated.onboarding.flowVersion).toBe(2);
    expect(migrated.onboarding.draftChild).toEqual(nara);
    expect(migrated.onboarding.draftItems).toEqual(draftItems);
    expect(migrated.data.role).toBe('Ayah');
  });

  it.each([3, 4, 5])('asks for a missing role once from old step %i without erasing drafts', oldStep => {
    const migrated = migrateOnboarding(legacyAccount(oldStep, ''));
    expect(migrated.onboarding.step).toBe(1);
    expect(migrated.onboarding.draftChild).toEqual(nara);
    expect(migrated.onboarding.draftItems).toEqual(draftItems);
  });

  it('keeps completed spaces complete and leaves family records untouched', () => {
    const original = legacyAccount(6);
    original.data = space();
    original.onboarding.status = 'complete';
    const migrated = migrateOnboarding(original);
    expect(migrated.onboarding).toEqual({
      status: 'complete',
      step: 5,
      draftChild: nara,
      draftItems,
      flowVersion: 2,
    });
    expect(migrated.data).toEqual(original.data);
  });

  it('uses Ibu when the displayed default was never changed and keeps an explicit role', () => {
    expect(roleForOnboarding('')).toBe('Ibu');
    expect(roleForOnboarding('Ayah')).toBe('Ayah');
  });
});

describe('Interrupted onboarding', () => {
  it('keeps the step and the half-typed child for a later resume', () => {
    const saved = patchOnboarding(account(space({ children: [], selected: '' })), { step: 3, draftChild: nara, draftItems: [{ id: 'rice', quantity: 1 }] });
    expect(saved.onboarding).toEqual({ status: 'in-progress', step: 3, draftChild: nara, draftItems: [{ id: 'rice', quantity: 1 }], flowVersion: 2 });
  });

  it('clamps the saved step inside the five-stage flow', () => {
    expect(patchOnboarding(account(space()), { step: 9 }).onboarding.step).toBe(5);
    expect(patchOnboarding(account(space()), { step: 0 }).onboarding.step).toBe(1);
  });
});
