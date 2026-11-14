import { createContext, useContext, useEffect, useState, type Context as ReactContext, type ReactNode } from 'react';
import { toast } from 'sonner';
import { useLanguage } from './language';
import { emptyState, type AppState, type Child, type InventoryEntry } from '@/lib/asah';
import {
  addChild,
  confirmReconcile,
  createAccount,
  destinationFor,
  finishOnboarding,
  freshState,
  isRoot,
  looksLikeAppState,
  migrateLegacy,
  emptyRoot,
  type Account,
  type Destination,
  type OnboardingState,
  type RootState,
} from '@/lib/account';

type Store = {
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;
  ready: boolean;
  now: Date;
  online: boolean;
  child: Child | undefined;
  account: Account | null;
  accounts: Account[];
  onboarding: OnboardingState;
  destination: Destination;
  createSpace: (name: string) => void;
  signIn: (id: string) => void;
  signOut: () => void;
  renameSpace: (name: string) => void;
  patchOnboarding: (patch: Partial<OnboardingState>) => void;
  saveRole: (role: string) => void;
  finish: (child: Child, items: InventoryEntry[], skipped: boolean) => void;
  confirmData: () => void;
  addExistingChild: (child: Child) => void;
  deleteSpace: () => void;
};
// Preserve context identity across Vite updates. Existing mounted providers and
// newly refreshed consumers must reference the same context object.
const Context: ReactContext<Store | null> = import.meta.hot?.data?.asahContext ?? createContext<Store | null>(null);
if (import.meta.hot?.data) import.meta.hot.data.asahContext = Context;
const ROOT_KEY = 'asah-accounts-v1';
const LEGACY_KEY = 'asah-prototype-v1';

export function AsahProvider({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const [root, setRoot] = useState<RootState>(emptyRoot);
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(new Date('2026-11-14T00:00:00Z'));
  const [online, setOnline] = useState(true);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ROOT_KEY);
      let next: RootState | null = null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isRoot(parsed)) next = parsed;
        else toast.error(t('Data tidak dapat dibaca. Mulai dengan profil baru.'));
      }
      // Data saved before family spaces existed always wins over an empty space
      // list, so it gets confirmed instead of being stranded behind a blank start.
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy && (!next || next.accounts.length === 0)) {
        const parsed = JSON.parse(legacy);
        if (looksLikeAppState(parsed)) {
          const adopted = migrateLegacy(parsed, crypto.randomUUID(), new Date().toISOString());
          next = { version: 2, accounts: [adopted], activeId: adopted.id };
          // Remove the old single-user copy so deleting data really deletes it.
          localStorage.removeItem(LEGACY_KEY);
        } else {
          toast.error(t('Data lama tidak dapat dibaca. Mulai dengan profil baru.'));
        }
      }
      setRoot(next ?? emptyRoot);
    } catch {
      toast.error(t('Data tidak dapat dibaca. Penyimpanan mungkin tidak tersedia.'));
    }
    setReady(true);
    setNow(new Date());
    setOnline(navigator.onLine);
    const tick = setInterval(() => setNow(new Date()), 1000);
    const status = () => setOnline(navigator.onLine);
    window.addEventListener('online', status);
    window.addEventListener('offline', status);
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
    return () => {
      clearInterval(tick);
      window.removeEventListener('online', status);
      window.removeEventListener('offline', status);
    };
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(ROOT_KEY, JSON.stringify(root));
      } catch {
        toast.error(t('Data belum tersimpan. Ruang penyimpanan mungkin penuh.'));
      }
    }
  }, [root, ready]);
  const account = root.accounts.find(item => item.id === root.activeId) ?? null;
  const writeAccount = (fn: (account: Account) => Account) =>
    setRoot(current =>
      current.activeId
        ? { ...current, accounts: current.accounts.map(item => (item.id === current.activeId ? fn(item) : item)) }
        : current,
    );
  const value: Store = {
    state: account?.data ?? freshState(),
    update: fn => writeAccount(item => ({ ...item, data: fn(item.data) })),
    ready,
    now,
    online,
    child: account ? account.data.children.find(item => item.id === account.data.selected) : undefined,
    account,
    accounts: root.accounts,
    onboarding: account?.onboarding ?? { status: 'in-progress', step: 1, draftChild: null, draftItems: [] },
    destination: destinationFor({ ready, account }),
    createSpace: name => {
      const created = createAccount(name, crypto.randomUUID(), new Date().toISOString());
      setRoot(current => ({ version: 2, accounts: [...current.accounts, created], activeId: created.id }));
    },
    signIn: id =>
      setRoot(current => (current.accounts.some(item => item.id === id) ? { ...current, activeId: id } : current)),
    signOut: () => setRoot(current => ({ ...current, activeId: null })),
    renameSpace: name => writeAccount(item => ({ ...item, name: name.trim() || item.name })),
    patchOnboarding: patch =>
      writeAccount(item => ({
        ...item,
        onboarding: {
          ...item.onboarding,
          ...patch,
          step: Math.min(6, Math.max(1, Math.round(patch.step ?? item.onboarding.step))),
        },
      })),
    saveRole: role => writeAccount(item => ({ ...item, data: { ...item.data, role } })),
    finish: (child, items, skipped) => writeAccount(item => finishOnboarding(item, child, items, skipped)),
    confirmData: () => writeAccount(confirmReconcile),
    addExistingChild: child => writeAccount(item => addChild(item, child)),
    // Erasing a space removes its records and ends the session; the person must
    // be able to leave the app with nothing left behind in this browser.
    deleteSpace: () =>
      setRoot(current => ({
        version: 2,
        accounts: current.accounts.filter(item => item.id !== current.activeId),
        activeId: null,
      })),
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAsah(): Store {
  const value = useContext<Store | null>(Context);
  if (!value) throw new Error('AsahProvider required');
  return value;
}
export { emptyState };
