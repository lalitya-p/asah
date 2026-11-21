import { describe, expect, it } from 'vitest';
import type { Completion } from '@/lib/asah';
import { gardenCounts, gardenStory, GARDEN_STORY_MS, storyFrameIndex } from '@/lib/garden-story';

const moment = (id: string, at: string, areas: string[], childId = 'child'): Completion => ({ id, at, areas, childId, activityId: 'sample', title: 'Sample', focus: '', stage: 1, duration: 5 });
describe('garden growth story', () => {
  it('replays chronologically without modifying saved records', () => {
    const moments = [moment('later', '2026-11-21', ['hands']), moment('first', '2026-11-20', ['talking'])];
    const frames = gardenStory(moments);
    expect(frames.map(f => f.moment.id)).toEqual(['first', 'later']);
    expect(moments.map(m => m.id)).toEqual(['later', 'first']);
  });
  it('increments only the logged skill areas and never decreases their counts', () => {
    const frames = gardenStory([moment('1', '2026-11-19', ['moving', 'talking', 'moving']), moment('2', '2026-11-20', ['hands'])]);
    expect(frames[0]?.counts).toEqual({ moving: 1, talking: 1, hands: 0, others: 0 });
    expect(frames[1]?.counts).toEqual({ moving: 1, talking: 1, hands: 1, others: 0 });
  });
  it('finishes in 5.5 seconds for both short and long histories', () => {
    expect(GARDEN_STORY_MS).toBe(5500);
    for (const length of [1, 3, 25, 200]) {
      expect(storyFrameIndex(0, length)).toBe(-1);
      expect(storyFrameIndex(5500, length)).toBe(length - 1);
    }
  });
  it('ends with exactly the live garden counts without adding moments', () => {
    const moments = [moment('1', '2026-11-19', ['moving']), moment('2', '2026-11-20', ['hands', 'talking'])];
    expect(gardenStory(moments).at(-1)?.counts).toEqual(gardenCounts(moments));
    expect(moments).toHaveLength(2);
    expect(gardenStory([])).toEqual([]);
    expect(storyFrameIndex(5500, 0)).toBe(-1);
  });
});