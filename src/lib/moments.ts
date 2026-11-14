import { ACTIVITIES, AREAS, ageGroupFor, type AreaId, type Lang } from '@/data/asahActivities';
import type { Completion } from '@/lib/asah';

export const areaIds = Object.keys(AREAS) as AreaId[];
export function ageGroupLabel(months: number, lang: Lang): string {
  const [from, to] = ageGroupFor(months);
  return to <= 24 ? `${from}–${to} ${lang === 'en' ? 'months' : 'bulan'}` : `${from / 12}–${to / 12} ${lang === 'en' ? 'years' : 'tahun'}`;
}
export function activitiesForAge(months: number) {
  const [from, to] = ageGroupFor(months);
  return ACTIVITIES.filter(a => a.ageGroup[0] === from && a.ageGroup[1] === to);
}
/** Play moments for one child (logged via the Development flow). Every answer counts. */
export function childMoments(logs: Completion[], childId: string | undefined) {
  return logs.filter(l => l.childId === childId && Array.isArray(l.areas));
}
export function momentsInArea(moments: Completion[], area: AreaId) {
  return moments.filter(m => m.areas?.includes(area));
}
/** A new garden contains seeds only; logging any moment triggers the existing grown artwork. */
export function gardenHasGrowth(momentCount: number) {
  return momentCount > 0;
}
