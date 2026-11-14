import { describe, expect, it } from 'vitest';
import { emptyState, migrateState, type HouseholdInventory, type InventoryEntry } from '@/lib/asah';
import { activities, activityFor } from '@/lib/catalog';
import { evaluateMaterials, missingMaterials, type MaterialMetadata } from '@/lib/inventory';
import { activitiesForAge } from '@/lib/moments';

const inventory = (status: HouseholdInventory['status'], items: InventoryEntry[] = []): HouseholdInventory => ({ status, items });
const entry = (id: string, quantity = 1, equivalentId?: string): InventoryEntry => ({ id, quantity, ...(equivalentId ? { equivalentId } : {}) });

 describe('Household inventory eligibility', () => {
  it('allows only material-free recommendations when setup is skipped', () => {
    const skipped = inventory('skipped');
    expect(activities.filter(activity => evaluateMaterials(activity, skipped).eligible).every(activity => activity.materialFree)).toBe(true);
    expect(activityFor(3, 0, skipped)?.id).toBe('s3-1');
  });

  it('provides a material-free activity at every developmental stage', () => {
    for (let stage = 1; stage <= 5; stage++) expect(activityFor(stage, 0, inventory('not-set'))?.materialFree).toBe(true);
  });

  it('requires the full quantity of a required item', () => {
    const activity = activities.find(item => item.id === 's3-3')!;
    expect(activity.requiredMaterials[0]).toEqual({ itemId: 'container-large', quantity: 2, substituteItemIds: [] });
    expect(evaluateMaterials(activity, inventory('complete', [entry('container-large')])).missing).toEqual([{ itemId: 'container-large', quantity: 1 }]);
    expect(evaluateMaterials(activity, inventory('complete', [entry('container-large', 2)])).eligible).toBe(true);
  });

  it('combines quantities only from explicitly approved substitutes', () => {
    const activity: MaterialMetadata = { materialFree: false, optionalMaterials: [], requiredMaterials: [{ itemId: 'container-large', quantity: 2, substituteItemIds: ['bowl-large'] }] };
    expect(evaluateMaterials(activity, inventory('complete', [entry('container-large'), entry('bowl-large')])).eligible).toBe(true);
    expect(evaluateMaterials(activity, inventory('complete', [entry('container-large'), entry('picture-book')])).eligible).toBe(false);
  });

  it('counts a custom item only through its parent-selected equivalent', () => {
    const required = [{ itemId: 'ball-large', quantity: 1, substituteItemIds: [] }];
    expect(missingMaterials(required, [entry('custom-1', 1, 'ball-large')])).toEqual([]);
    expect(missingMaterials(required, [entry('custom-1')])).toEqual([{ itemId: 'ball-large', quantity: 1 }]);
  });

  it('does not let optional items block a material-free Development activity', () => {
    expect(activitiesForAge(7, inventory('skipped')).map(activity => activity.id)).toEqual(['ciluk-ba', 'tiru-suara']);
  });

  it('unlocks Development activities only when all required items are present', () => {
    const partial = inventory('complete', [entry('empty-bottle'), entry('rice')]);
    expect(activitiesForAge(7, partial).map(activity => activity.id)).toEqual(['ciluk-ba', 'tiru-suara']);
    const complete = inventory('complete', [entry('empty-bottle'), entry('rice'), entry('tape'), entry('ball-large')]);
    expect(activitiesForAge(7, complete).map(activity => activity.id)).toEqual(['ciluk-ba', 'botol-bunyi', 'raih-bola', 'tiru-suara']);
  });

  it('initializes existing families with not-set inventory without touching their records', () => {
    const legacy = { ...emptyState, children: [{ id: 'a', name: 'Nara', dob: '2023-01-01' }], selected: 'a', consent: true };
    const { inventory: _inventory, ...withoutInventory } = legacy;
    const migrated = migrateState(withoutInventory);
    expect(migrated.inventory).toEqual({ status: 'not-set', items: [] });
    expect(migrated.children).toEqual(legacy.children);
    expect(migrated.logs).toBe(legacy.logs);
  });

  it('keeps existing Stage 4 activity IDs stable when adding the material-free option', () => {
    expect(activities.find(activity => activity.title === 'Menara kecil, ide besar')?.id).toBe('s4-0');
    expect(activities.find(activity => activity.id === 's4-6')?.materialFree).toBe(true);
  });

  it('treats only body, voice, and safe surroundings as material-free', () => {
    const nonInventoryMaterials = new Set([
      'Wajah dan suara Anda', 'Suara Anda', 'Tangan Anda', 'Wajah Anda',
      'Alas datar yang bersih', 'Alas datar', 'Lantai datar yang bersih',
      'Tubuh dan suara Anda', 'Tempat duduk yang nyaman',
    ]);
    for (const activity of activities.filter(item => item.materialFree)) {
      expect(activity.materials.every(material => nonInventoryMaterials.has(material)), activity.title).toBe(true);
    }
  });
});
