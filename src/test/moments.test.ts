import { describe, expect, it } from 'vitest';
import { activitiesForAge, ageGroupLabel, childMoments, gardenHasGrowth, momentsInArea } from '@/lib/moments';
import { addCompletion, editObservation, emptyState, type Completion } from '@/lib/asah';
import { activities as dailyActivities } from '@/lib/catalog';
import { ACTIVITIES, AGE_GROUPS } from '@/data/asahActivities';
import type { HouseholdInventory } from '@/lib/asah';
const m = (id: string, noticed: number, areas: string[], childId = 'c'): Completion => ({ id, childId, activityId: 'ciluk-ba', title: '', focus: '', stage: 2, duration: 5, at: '', noticed, areas });
describe('development moments', () => {
  it('shows only the current Buku KIA group label', () => { expect(ageGroupLabel(7, 'en')).toBe('6–9 months'); expect(ageGroupLabel(30, 'id')).toBe('2–3 tahun'); });
  it('offers only activities of the current age group', () => { expect(activitiesForAge(7).length).toBe(6); expect(activitiesForAge(13).length).toBeGreaterThan(0); });
  it('gives every age group ideas that work without household items', () => {
    const skipped: HouseholdInventory = { status: 'skipped', items: [] };
    for (const [from, to] of AGE_GROUPS) {
      const months = from + 1;
      const all = activitiesForAge(months);
      expect(all.length, `${from}-${to} months`).toBeGreaterThan(0);
      expect(all.every(a => a.ageGroup[0] === from && a.ageGroup[1] === to), `${from}-${to} months`).toBe(true);
      expect(all.filter(a => a.materialFree).length, `${from}-${to} months material-free`).toBeGreaterThanOrEqual(2);
      expect(activitiesForAge(months, skipped).length, `${from}-${to} months with skipped inventory`).toBeGreaterThanOrEqual(2);
    }
  });
  it('provides a bilingual type, short description, and developmental benefit for every carousel activity', () => {
    for (const activity of ACTIVITIES) {
      expect(activity.category.id.length, activity.id).toBeGreaterThan(0);
      expect(activity.category.en.length, activity.id).toBeGreaterThan(0);
      expect(activity.description.id.length, activity.id).toBeGreaterThan(0);
      expect(activity.description.en.length, activity.id).toBeGreaterThan(0);
      expect(activity.benefit.id.length, activity.id).toBeGreaterThan(0);
      expect(activity.benefit.en.length, activity.id).toBeGreaterThan(0);
      expect(activity.areas.length, activity.id).toBeGreaterThan(0);
    }
  });
  it('counts "Not interested today" as a moment', () => { const moments = childMoments([m('a', 3, ['others']), m('b', 0, ['others', 'talking']), m('x', 0, ['others'], 'other')], 'c'); expect(moments).toHaveLength(2); expect(momentsInArea(moments, 'others')).toHaveLength(2); });
  it('starts every newly initialized garden without vegetation', () => { expect(gardenHasGrowth(childMoments(emptyState.logs, 'new-child').length)).toBe(false); });
  it('allows vegetation only after a growth-triggering moment is logged', () => { expect(gardenHasGrowth(childMoments([m('a', 0, ['others'])], 'c').length)).toBe(true); });
  it('counts a finished homepage activity in its Development area', () => {
    const activity = dailyActivities.find(item => item.id === 's4-0');
    if (!activity) throw new Error('Missing homepage sample activity');
    expect(activity.areas).toEqual(['hands']);
    const completion: Completion = { id: 'daily', childId: 'c', activityId: 's4-0', title: 'Menara kecil, ide besar', focus: 'Motorik halus', stage: 4, duration: 5, at: '', response: 'Ya', areas: activity.areas };
    const moments = childMoments([completion], 'c');
    expect(moments).toHaveLength(1);
    expect(momentsInArea(moments, 'hands')).toHaveLength(1);
  });
  it('reads area IDs for an older homepage completion without changing its response or saved record', () => {
    const legacy: Completion = { id: 'legacy', childId: 'c', activityId: 's4-0', title: 'Menara kecil, ide besar', focus: 'Motorik halus', stage: 4, duration: 5, at: '', response: 'Sedikit' };
    const moment = childMoments([legacy], 'c')[0];
    expect(moment?.areas).toEqual(['hands']);
    expect(moment?.response).toBe('Sedikit');
    expect(legacy.areas).toBeUndefined();
  });
  it('assigns at least one Development area to every homepage activity', () => {
    expect(dailyActivities.every(activity => activity.areas.length > 0)).toBe(true);
  });
  it('adds a response to the same finished-playing moment instead of duplicating it', () => {
    const saved = addCompletion([], { id: 'moment-1', childId: 'c', activityId: 's4-0', title: 'Menara kecil, ide besar', focus: 'Motorik halus', stage: 4, duration: 5, at: '', areas: ['hands'] });
    const answered = editObservation(saved, 'moment-1', 'Ya');
    expect(answered).toHaveLength(1);
    expect(answered[0]?.response).toBe('Ya');
    expect(answered[0]?.areas).toEqual(['hands']);
  });
});
