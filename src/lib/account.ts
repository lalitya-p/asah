import {
  ageMonths,
  emptyState,
  migrateState,
  type AppState,
  type Child,
  type InventoryEntry,
} from './asah';

export const ONBOARDING_STEP_COUNT = 5;
export const ONBOARDING_FLOW_VERSION = 2;
export type OnboardingStatus = 'in-progress' | 'complete';
export type OnboardingState = {
  status: OnboardingStatus;
  step: number;
  draftChild: Child | null;
  draftItems: InventoryEntry[];
  flowVersion: number;
};
export type Account = {
  id: string;
  name: string;
  createdAt: string;
  needsReconcile: boolean;
  onboarding: OnboardingState;
  data: AppState;
};
export type RootState = { version: 2; accounts: Account[]; activeId: string | null };
export type Destination = 'boot' | 'welcome' | 'reconcile' | 'onboarding' | 'setup-child' | 'app';

export const emptyRoot: RootState = { version: 2, accounts: [], activeId: null };

// A fresh AppState must never share its mutable containers with the module-level
// emptyState, or one family space would write into another one's records.
export function freshState(): AppState {
  return {
    ...emptyState,
    days: {},
    logs: [],
    saved: [],
    inventory: { status: 'not-set', items: [] },
  };
}

export function newOnboarding(): OnboardingState {
  return { status: 'in-progress', step: 1, draftChild: null, draftItems: [], flowVersion: ONBOARDING_FLOW_VERSION };
}

export function clampStep(step: number): number {
  if (!Number.isFinite(step)) return 1;
  return Math.min(ONBOARDING_STEP_COUNT, Math.max(1, Math.round(step)));
}

export function roleForOnboarding(role: string): string {
  return role || 'Ibu';
}

export function createAccount(name: string, id: string, createdAt: string): Account {
  return {
    id,
    name: name.trim() || 'Asah',
    createdAt,
    needsReconcile: false,
    onboarding: newOnboarding(),
    data: freshState(),
  };
}

// Version 1 started with a generic introduction and used six numbered stages.
// Move interrupted people to the equivalent version-2 screen without touching
// their role, child draft, household draft, or family records.
export function migrateOnboarding(account: Account): Account {
  const current = account.onboarding;
  if (current.flowVersion === ONBOARDING_FLOW_VERSION) return account;
  const draftChild = current.draftChild ?? null;
  const draftItems = current.draftItems ?? [];
  if (current.status === 'complete') {
    return {
      ...account,
      onboarding: {
        status: 'complete',
        step: ONBOARDING_STEP_COUNT,
        draftChild,
        draftItems,
        flowVersion: ONBOARDING_FLOW_VERSION,
      },
    };
  }
  const oldStep = Math.min(6, Math.max(1, Math.round(Number.isFinite(current.step) ? current.step : 1)));
  let step = 1;
  if (account.data.role) {
    if (oldStep === 3) step = 2;
    else if (oldStep === 4 && draftChild) step = 3;
    else if (oldStep >= 5 && draftChild) step = 4;
    else if (oldStep >= 3) step = 2;
  }
  return {
    ...account,
    onboarding: {
      status: 'in-progress',
      step,
      draftChild,
      draftItems,
      flowVersion: ONBOARDING_FLOW_VERSION,
    },
  };
}

// "Has children + consent given" is the only reliable evidence that the
// developmental introduction was already seen. Anything partial stays incomplete.
export function hasOnboardingEvidence(data: AppState): boolean {
  return data.children.length > 0 && data.consent === true;
}

export function onboardingForEvidence(data: AppState): OnboardingState {
  return hasOnboardingEvidence(data)
    ? { status: 'complete', step: ONBOARDING_STEP_COUNT, draftChild: null, draftItems: [], flowVersion: ONBOARDING_FLOW_VERSION }
    : newOnboarding();
}

// The device-only prototype used to keep one anonymous blob for the whole
// browser. Adopt it as a single space that must be confirmed before use.
export function migrateLegacy(parsed: Partial<AppState>, id: string, createdAt: string): Account {
  const data = migrateState(parsed);
  return {
    id,
    name: data.children[0]?.name.trim().split(/\s+/)[0] || 'Asah',
    createdAt,
    needsReconcile: true,
    onboarding: onboardingForEvidence(data),
    data,
  };
}

export type ReconcileSummary = {
  children: { name: string; months: number }[];
  logs: number;
  saved: number;
  items: number;
  role: string;
  evidence: boolean;
};

export function reconcileSummary(data: AppState, now: Date): ReconcileSummary {
  return {
    children: data.children.map(child => ({ name: child.name, months: ageMonths(child.dob, now) })),
    logs: data.logs.length,
    saved: data.saved.length,
    items: data.inventory.items.length,
    role: data.role,
    evidence: hasOnboardingEvidence(data),
  };
}

export function confirmReconcile(account: Account): Account {
  return {
    ...account,
    needsReconcile: false,
    onboarding: onboardingForEvidence(account.data),
  };
}

export function patchOnboarding(account: Account, patch: Partial<OnboardingState>): Account {
  const migrated = migrateOnboarding(account);
  const next = { ...migrated.onboarding, ...patch, flowVersion: ONBOARDING_FLOW_VERSION };
  return { ...migrated, onboarding: { ...next, step: clampStep(next.step) } };
}

export function setRole(account: Account, role: string): Account {
  return { ...account, data: { ...account.data, role } };
}

// Saving a household inventory is optional; an empty or skipped one still
// counts as "seen" so only material-free play is recommended.
export function finishOnboarding(
  account: Account,
  child: Child,
  items: InventoryEntry[],
  skipped: boolean,
): Account {
  const alreadyThere = account.data.children.some(item => item.id === child.id);
  return {
    ...account,
    onboarding: {
      status: 'complete',
      step: ONBOARDING_STEP_COUNT,
      draftChild: child,
      draftItems: items,
      flowVersion: ONBOARDING_FLOW_VERSION,
    },
    data: {
      ...account.data,
      children: alreadyThere ? account.data.children : [...account.data.children, child],
      selected: child.id,
      consent: true,
      inventory: { status: !skipped && items.length ? 'complete' : 'skipped', items },
    },
  };
}

// Adding another child never restarts onboarding and never re-asks the role.
export function addChild(account: Account, child: Child): Account {
  if (account.data.children.some(item => item.id === child.id)) return account;
  return {
    ...account,
    onboarding: {
      ...account.onboarding,
      status: 'complete',
      step: ONBOARDING_STEP_COUNT,
      flowVersion: ONBOARDING_FLOW_VERSION,
    },
    data: {
      ...account.data,
      children: [...account.data.children, child],
      selected: child.id,
      consent: true,
    },
  };
}

// Onboarding stays complete: a space that lost every child needs child setup,
// not the educational introduction replayed from the beginning.
export function destinationFor(input: { ready: boolean; account: Account | null }): Destination {
  if (!input.ready) return 'boot';
  const account = input.account;
  if (!account) return 'welcome';
  if (account.needsReconcile) return 'reconcile';
  if (account.onboarding.status !== 'complete') return 'onboarding';
  if (!account.data.children.length) return 'setup-child';
  return 'app';
}

export function isRoot(value: unknown): value is RootState {
  if (typeof value !== 'object' || value === null) return false;
  const root = value as Partial<RootState>;
  return Array.isArray(root.accounts) && (root.activeId === null || typeof root.activeId === 'string');
}

export function looksLikeAppState(value: unknown): value is Partial<AppState> {
  if (typeof value !== 'object' || value === null) return false;
  const state = value as Partial<AppState>;
  return Array.isArray(state.children) && Array.isArray(state.logs) && Array.isArray(state.saved);
}
