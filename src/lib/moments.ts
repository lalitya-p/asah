import { ACTIVITIES, AREAS, ageGroupFor, type AreaId, type Lang } from '@/data/asahActivities';
import { activities as dailyActivities } from '@/lib/catalog';
import type { Completion, HouseholdInventory } from '@/lib/asah';
import { evaluateMaterials } from '@/lib/inventory';

export const areaIds = Object.keys(AREAS) as AreaId[];
export function ageGroupLabel(months: number, lang: Lang): string {
  const [from, to] = ageGroupFor(months);
  return to <= 24 ? `${from}–${to} ${lang === 'en' ? 'months' : 'bulan'}` : `${from / 12}–${to / 12} ${lang === 'en' ? 'years' : 'tahun'}`;
}
export function activitiesForAge(months: number, inventory?: HouseholdInventory) {
  const [from, to] = ageGroupFor(months);
  return ACTIVITIES.filter(a => a.ageGroup[0] === from && a.ageGroup[1] === to && (!inventory || evaluateMaterials(a, inventory).eligible));
}

export function completionAreas(log: Completion): AreaId[] {
  if (Array.isArray(log.areas)) return log.areas.filter((area): area is AreaId => area in AREAS);
  // Older Today completions did not store area IDs. Read their static catalog
  // metadata without rewriting or deleting the family's saved record.
  return dailyActivities.find(activity => activity.id === log.activityId)?.areas
    ?? ACTIVITIES.find(activity => activity.id === log.activityId)?.areas
    ?? [];
}

/** Every play moment counts for this child; area answers never infer ability. */
export function childMoments(logs: Completion[], childId: string | undefined) {
  return logs.filter(log => log.childId === childId).map(log => ({ ...log, areas: completionAreas(log) }));
}
export function momentsInArea(moments: Completion[], area: AreaId) {
  return moments.filter(m => m.areas?.includes(area));
}
/** A new garden contains seeds only; logging any moment triggers the existing grown artwork. */
export function gardenHasGrowth(momentCount: number) {
  return momentCount > 0;
}
