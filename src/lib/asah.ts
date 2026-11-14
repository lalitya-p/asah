export type Plan = 'free' | 'pro';
export type Response = 'Ya' | 'Sedikit' | 'Belum';
export type Child = { id: string; name: string; dob: string };
export const caregiverRoles = ['Ibu', 'Ayah', 'Kakek / Nenek', 'Pengasuh'] as const;
export type DayState = { day: string; used: number; choice: number; duration: 1 | 5 | 10 };
export type Completion = { id: string; childId: string; activityId: string; title: string; focus: string; stage: number; duration: number; at: string; response?: Response; noticed?: number; areas?: string[]; note?: string };
export type Saved = { activityId: string; childId: string; stage: number; duration: 1 | 5 | 10 };
export type AppState = { children: Child[]; selected: string; plan: Plan; role: string; days: Record<string, DayState>; logs: Completion[]; saved: Saved[]; consent: boolean };
export const emptyState: AppState = { children: [], selected: '', plan: 'free', role: '', days: {}, logs: [], saved: [], consent: false };
// Caregiver role lives at account level. Older saves stored it per child; adopt the
// first child's role once and strip per-child roles without touching other data.
export function migrateState(parsed: Partial<AppState> & { children?: (Child & { role?: string })[] }): AppState {
  const children = (parsed.children ?? []).map(({ id, name, dob }) => ({ id, name, dob }));
  return { ...emptyState, ...parsed, children, role: typeof parsed.role === 'string' && parsed.role ? parsed.role : parsed.children?.[0]?.role ?? '' };
}

export function jakartaDay(now: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const part = (type: string) => parts.find(p => p.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}
export function ageMonths(dob: string, now: Date): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return -1;
  const [by, bm, bd] = dob.split('-').map(Number);
  if (by === undefined || bm === undefined || bd === undefined) return -1;
  const valid = new Date(Date.UTC(by, bm - 1, bd));
  if (valid.getUTCFullYear() !== by || valid.getUTCMonth() !== bm - 1 || valid.getUTCDate() !== bd) return -1;
  const today = jakartaDay(now);
  if (dob > today) return -1;
  const [y, m, d] = today.split('-').map(Number);
  if (y === undefined || m === undefined || d === undefined) return -1;
  const anniversary = Math.min(bd, new Date(Date.UTC(y, m, 0)).getUTCDate());
  return (y - by) * 12 + m - bm - (d < anniversary ? 1 : 0);
}
export function stageFor(months: number): number | null {
  if (months < 0 || months >= 72) return null;
  if (months < 4) return 1;
  if (months < 12) return 2;
  if (months < 24) return 3;
  if (months < 48) return 4;
  return 5;
}
export function ageLabel(months: number): string {
  if (months < 0) return 'Tanggal belum valid';
  const years = Math.floor(months / 12), rest = months % 12;
  return years ? `${years} tahun${rest ? ` ${rest} bulan` : ''}` : `${months} bulan`;
}
export function currentDay(value: DayState | undefined, now: Date): DayState {
  const day = jakartaDay(now);
  return value?.day === day ? value : { day, used: 0, choice: 0, duration: value?.duration ?? 5 };
}
export function replaceActivity(value: DayState, plan: Plan): DayState {
  if (plan === 'free' && value.used >= 5) return value;
  return { ...value, used: value.used + (plan === 'free' ? 1 : 0), choice: value.choice + 1 };
}
export function setDuration(value: DayState, duration: 1 | 5 | 10): DayState { return { ...value, duration }; }
export function editObservation(logs: Completion[], id: string, response: Response): Completion[] { return logs.map(log => log.id === id ? { ...log, response } : log); }
export function addCompletion(logs: Completion[], completion: Completion): Completion[] { return [completion, ...logs]; }
export function sampleChild(now: Date): Child {
  const [y = 2026, m = 11] = jakartaDay(now).split('-').map(Number);
  return { id: 'sample-nara', name: 'Nara', dob: `${y - 3}-${String(m).padStart(2, '0')}-01` };
}