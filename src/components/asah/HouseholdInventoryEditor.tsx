import { useState } from 'react';
import { Minus, Plus, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/asah/language';
import { householdItems, inventoryCategories, inventoryItemLabel } from '@/lib/inventory';
import type { InventoryEntry } from '@/lib/asah';

export function HouseholdInventoryEditor({ items, onChange }: { items: InventoryEntry[]; onChange: (items: InventoryEntry[]) => void }) {
  const { language: lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [customName, setCustomName] = useState('');
  const [equivalentId, setEquivalentId] = useState('');
  const query = search.trim().toLocaleLowerCase();
  const filtered = householdItems.filter(item => (category === 'all' || item.category === category) && (!query || item.label.id.toLocaleLowerCase().includes(query) || item.label.en.toLocaleLowerCase().includes(query)));
  const customItems = items.filter(item => item.customName);

  const toggle = (itemId: string) => {
    const existing = items.find(item => item.id === itemId);
    onChange(existing ? items.filter(item => item.id !== itemId) : [...items, { id: itemId, quantity: 1 }]);
  };
  const setQuantity = (id: string, quantity: number) => onChange(items.map(item => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item));
  const addCustom = () => {
    if (!customName.trim()) return;
    onChange([...items, { id: `custom-${crypto.randomUUID()}`, quantity: 1, customName: customName.trim(), category: 'other', ...(equivalentId ? { equivalentId } : {}) }]);
    setCustomName('');
    setEquivalentId('');
  };

  return <div className="inventory-editor">
    <label className="inventory-search"><Search size={18} aria-hidden="true" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder={lang === 'en' ? 'Search household items' : 'Cari barang di rumah'} aria-label={lang === 'en' ? 'Search household items' : 'Cari barang di rumah'} /></label>
    <div className="inventory-categories" role="group" aria-label={lang === 'en' ? 'Item categories' : 'Kategori barang'}>
      <button type="button" className={category === 'all' ? 'selected' : ''} onClick={() => setCategory('all')}>{lang === 'en' ? 'All' : 'Semua'}</button>
      {inventoryCategories.map(item => <button type="button" key={item.id} className={category === item.id ? 'selected' : ''} onClick={() => setCategory(item.id)}>{item.label[lang]}</button>)}
    </div>
    <div className="inventory-list">
      {filtered.map(item => {
        const selected = items.find(entry => entry.id === item.id);
        return <div className={`inventory-item${selected ? ' selected' : ''}`} key={item.id}>
          <label><input type="checkbox" checked={Boolean(selected)} onChange={() => toggle(item.id)} /><span>{item.label[lang]}</span></label>
          {selected && <div className="quantity-control" aria-label={`${item.label[lang]} ${lang === 'en' ? 'quantity' : 'jumlah'}`}><button type="button" aria-label={lang === 'en' ? 'Decrease quantity' : 'Kurangi jumlah'} disabled={selected.quantity <= 1} onClick={() => setQuantity(item.id, selected.quantity - 1)}><Minus size={15} /></button><span>{selected.quantity}</span><button type="button" aria-label={lang === 'en' ? 'Increase quantity' : 'Tambah jumlah'} onClick={() => setQuantity(item.id, selected.quantity + 1)}><Plus size={15} /></button></div>}
        </div>;
      })}
      {!filtered.length && <p className="inventory-empty">{lang === 'en' ? 'No matching items. You can add a custom item below.' : 'Tidak ada barang yang cocok. Tambahkan barang sendiri di bawah.'}</p>}
    </div>

    {customItems.length > 0 && <div className="custom-items"><h3>{lang === 'en' ? 'Your custom items' : 'Barang tambahanmu'}</h3>{customItems.map(item => <div className="inventory-item selected" key={item.id}><div><b>{item.customName}</b>{item.equivalentId && <small>{lang === 'en' ? 'Same as: ' : 'Sama seperti: '}{inventoryItemLabel(item.equivalentId, lang)}</small>}</div><div className="quantity-control"><button type="button" aria-label={lang === 'en' ? 'Decrease quantity' : 'Kurangi jumlah'} disabled={item.quantity <= 1} onClick={() => setQuantity(item.id, item.quantity - 1)}><Minus size={15} /></button><span>{item.quantity}</span><button type="button" aria-label={lang === 'en' ? 'Increase quantity' : 'Tambah jumlah'} onClick={() => setQuantity(item.id, item.quantity + 1)}><Plus size={15} /></button><button type="button" aria-label={lang === 'en' ? `Remove ${item.customName}` : `Hapus ${item.customName}`} onClick={() => onChange(items.filter(entry => entry.id !== item.id))}><Trash2 size={15} /></button></div></div>)}</div>}

    <div className="custom-item-form"><h3>{lang === 'en' ? 'Add a custom item' : 'Tambah barang sendiri'}</h3><input className="field" value={customName} onChange={event => setCustomName(event.target.value)} placeholder={lang === 'en' ? 'Item name' : 'Nama barang'} /><select className="field filter-select" value={equivalentId} onChange={event => setEquivalentId(event.target.value)} aria-label={lang === 'en' ? 'Equivalent known item' : 'Padanan barang yang dikenal'}><option value="">{lang === 'en' ? 'No known-item equivalent' : 'Tidak ada padanan barang'}</option>{householdItems.map(item => <option key={item.id} value={item.id}>{item.label[lang]}</option>)}</select><p>{lang === 'en' ? 'An equivalent is never guessed. Choose one only when it is genuinely the same kind of item.' : 'Padanan tidak pernah ditebak. Pilih hanya jika barangnya memang sejenis.'}</p><Button type="button" variant="outline" disabled={!customName.trim()} onClick={addCustom}><Plus />{lang === 'en' ? 'Add item' : 'Tambah barang'}</Button></div>
  </div>;
}
