import type { Completion } from '@/lib/asah';
import type { AreaId } from '@/data/asahActivities';
import { areaIds, completionAreas } from '@/lib/moments';

export const GARDEN_STORY_MS = 5500;
export function emptyGardenCounts(): Record<AreaId, number> {
  return { moving: 0, hands: 0, talking: 0, others: 0 };
}

/** Replay saved moments without writing to the family log or changing growth rules. */
export function gardenStory(moments: Completion[]) {
  const counts = emptyGardenCounts();
  const chronological = [...moments].sort((a, b) => {
    const left = Date.parse(a.at);
    const right = Date.parse(b.at);
    return (Number.isFinite(left) ? left : 0) - (Number.isFinite(right) ? right : 0);
  });
  return chronological.map(moment => {
    const areas = [...new Set(completionAreas(moment))];
    for (const area of areas) counts[area] += 1;
    return { moment, areas, counts: { ...counts } };
  });
}

export function storyFrameIndex(elapsed: number, length: number): number {
  if (length === 0 || elapsed <= 0) return -1;
  return Math.min(length - 1, Math.floor(elapsed / GARDEN_STORY_MS * length));
}

export function gardenCounts(moments: Completion[]): Record<AreaId, number> {
  return Object.fromEntries(areaIds.map(area => [area, moments.filter(m => completionAreas(m).includes(area)).length])) as Record<AreaId, number>;
}