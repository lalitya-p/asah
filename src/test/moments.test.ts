import { describe, expect, it } from 'vitest';
import { activitiesForAge, ageGroupLabel, childMoments, momentsInArea } from '@/lib/moments';
import type { Completion } from '@/lib/asah';
const m = (id: string, noticed: number, areas: string[], childId = 'c'): Completion => ({ id, childId, activityId: 'ciluk-ba', title: '', focus: '', stage: 2, duration: 5, at: '', noticed, areas });
describe('development moments', () => {
  it('shows only the current Buku KIA group label', () => { expect(ageGroupLabel(7, 'en')).toBe('6–9 months'); expect(ageGroupLabel(30, 'id')).toBe('2–3 tahun'); });
  it('offers only activities of the current age group', () => { expect(activitiesForAge(7).length).toBe(4); expect(activitiesForAge(13)).toHaveLength(0); });
  it('counts "Not interested today" as a moment', () => { const moments = childMoments([m('a', 3, ['others']), m('b', 0, ['others', 'talking']), m('x', 0, ['others'], 'other')], 'c'); expect(moments).toHaveLength(2); expect(momentsInArea(moments, 'others')).toHaveLength(2); });
});
