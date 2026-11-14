import { createContext, useContext, useEffect, useState, type Context as ReactContext, type ReactNode } from 'react';
import { toast } from 'sonner';
import { emptyState, type AppState, type Child } from '@/lib/asah';

type Store = { state: AppState; update: (fn: (s: AppState) => AppState) => void; ready: boolean; now: Date; online: boolean; child: Child | undefined };
// Preserve context identity across Vite updates. Existing mounted providers and
// newly refreshed consumers must reference the same context object.
const Context: ReactContext<Store | null> = import.meta.hot?.data.asahContext ?? createContext<Store | null>(null);
if (import.meta.hot) import.meta.hot.data.asahContext = Context;
const KEY = 'asah-prototype-v1';
export function AsahProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(emptyState);
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(new Date('2026-11-14T00:00:00Z'));
  const [online, setOnline] = useState(true);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) { const parsed = JSON.parse(raw); if (Array.isArray(parsed.children) && Array.isArray(parsed.logs) && Array.isArray(parsed.saved) && parsed.days && typeof parsed.selected === 'string') setState(parsed); else toast.error('Data tidak dapat dibaca. Mulai dengan profil baru.'); } } catch { toast.error('Data tidak dapat dibaca. Penyimpanan mungkin tidak tersedia.'); }
    setReady(true); setNow(new Date()); setOnline(navigator.onLine);
    const tick = setInterval(() => setNow(new Date()), 1000);
    const status = () => setOnline(navigator.onLine);
    window.addEventListener('online', status); window.addEventListener('offline', status);
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
    return () => { clearInterval(tick); window.removeEventListener('online', status); window.removeEventListener('offline', status); };
  }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { toast.error('Data belum tersimpan. Ruang penyimpanan mungkin penuh.'); } } }, [state, ready]);
  return <Context.Provider value={{ state, update: fn => setState(fn), ready, now, online, child: state.children.find(c => c.id === state.selected) }}>{children}</Context.Provider>;
}
export function useAsah(): Store { const value = useContext<Store | null>(Context); if (!value) throw new Error('AsahProvider required'); return value; }