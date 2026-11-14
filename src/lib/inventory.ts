import type { HouseholdInventory, InventoryEntry } from '@/lib/asah';

type Lang = 'id' | 'en';
type Text = Record<Lang, string>;

export type MaterialRequirement = {
  itemId: string;
  quantity: number;
  substituteItemIds: string[];
};

export type MaterialMetadata = {
  materialFree: boolean;
  requiredMaterials: MaterialRequirement[];
  optionalMaterials: MaterialRequirement[];
};

export type MissingMaterial = { itemId: string; quantity: number };
export type MaterialEligibility = {
  eligible: boolean;
  reason: 'eligible' | 'inventory-incomplete' | 'missing-items';
  missing: MissingMaterial[];
};

export const inventoryCategories: { id: string; label: Text }[] = [
  { id: 'cloth', label: { id: 'Kain & alas', en: 'Cloth & play surfaces' } },
  { id: 'containers', label: { id: 'Wadah & dapur', en: 'Containers & kitchen' } },
  { id: 'toys', label: { id: 'Buku & mainan', en: 'Books & toys' } },
  { id: 'sound', label: { id: 'Botol & bunyi', en: 'Bottles & sound' } },
  { id: 'other', label: { id: 'Lainnya', en: 'Other' } },
];

export const householdItems: { id: string; category: string; label: Text }[] = [
  { id: 'cloth-large', category: 'cloth', label: { id: 'Kain besar bersih', en: 'Large clean cloth' } },
  { id: 'towel-blanket', category: 'cloth', label: { id: 'Handuk atau selimut', en: 'Towel or blanket' } },
  { id: 'play-mat', category: 'cloth', label: { id: 'Alas bermain', en: 'Play mat' } },
  { id: 'container-large', category: 'containers', label: { id: 'Wadah plastik besar', en: 'Large plastic container' } },
  { id: 'bowl-large', category: 'containers', label: { id: 'Mangkuk plastik besar', en: 'Large plastic bowl' } },
  { id: 'wooden-spoon', category: 'containers', label: { id: 'Sendok kayu besar', en: 'Large wooden spoon' } },
  { id: 'picture-book', category: 'toys', label: { id: 'Buku bergambar', en: 'Picture book' } },
  { id: 'doll-large', category: 'toys', label: { id: 'Boneka besar tanpa bagian lepas', en: 'Large doll without detachable parts' } },
  { id: 'ball-large', category: 'toys', label: { id: 'Bola besar', en: 'Large ball' } },
  { id: 'empty-bottle', category: 'sound', label: { id: 'Botol plastik kosong', en: 'Empty plastic bottle' } },
  { id: 'rice', category: 'sound', label: { id: 'Beras', en: 'Rice' } },
  { id: 'tape', category: 'sound', label: { id: 'Selotip', en: 'Tape' } },
];

export function inventoryItemLabel(itemId: string, lang: Lang) {
  return householdItems.find(item => item.id === itemId)?.label[lang] ?? itemId;
}

export function availableQuantity(items: InventoryEntry[], itemId: string) {
  return items
    .filter(entry => (entry.equivalentId ?? entry.id) === itemId)
    .reduce((total, entry) => total + Math.max(0, entry.quantity), 0);
}

export function missingMaterials(required: MaterialRequirement[], items: InventoryEntry[]): MissingMaterial[] {
  return required.flatMap(requirement => {
    const available = [requirement.itemId, ...requirement.substituteItemIds]
      .reduce((total, itemId) => total + availableQuantity(items, itemId), 0);
    const missing = Math.max(0, requirement.quantity - available);
    return missing ? [{ itemId: requirement.itemId, quantity: missing }] : [];
  });
}

export function evaluateMaterials(activity: MaterialMetadata, inventory: HouseholdInventory): MaterialEligibility {
  const missing = missingMaterials(activity.requiredMaterials, inventory.items);
  if (activity.materialFree) return { eligible: true, reason: 'eligible', missing: [] };
  if (inventory.status !== 'complete') return { eligible: false, reason: 'inventory-incomplete', missing };
  if (missing.length) return { eligible: false, reason: 'missing-items', missing };
  return { eligible: true, reason: 'eligible', missing: [] };
}

export function requirementLabel(requirement: MaterialRequirement, lang: Lang) {
  const label = inventoryItemLabel(requirement.itemId, lang);
  return requirement.quantity > 1 ? `${label} ×${requirement.quantity}` : label;
}

export function missingMaterialLabels(missing: MissingMaterial[], lang: Lang) {
  return missing.map(item => `${inventoryItemLabel(item.itemId, lang)} ×${item.quantity}`);
}
