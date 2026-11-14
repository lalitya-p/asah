import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/asah/language';
import { useAsah } from '@/components/asah/store';
import { ageMonths, caregiverRoles, stageFor, type Child } from '@/lib/asah';

export function ChildForm({ initial, onDone, onProfile, submitLabel, allowRoleQuestion = true }: {
  initial?: Child | undefined;
  onDone: () => void;
  onProfile?: (child: Child, role: string) => void;
  submitLabel?: string;
  allowRoleQuestion?: boolean;
}) {
  const { t } = useLanguage();
  const { state, update, now } = useAsah();
  const [name, setName] = useState(initial?.name ?? '');
  const [dob, setDob] = useState(initial?.dob ?? '');
  const [role, setRole] = useState('Ibu');
  const askRole = allowRoleQuestion && !state.role;
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(Boolean(initial));

  return <form className="space-y-5" onSubmit={event => {
    event.preventDefault();
    const months = ageMonths(dob, now);
    if (months < 0) {
      setError(t('Pilih tanggal lahir yang valid, bukan tanggal di masa depan.'));
      return;
    }
    if (!consent) {
      setError(t('Persetujuan diperlukan untuk menyimpan profil di perangkat.'));
      return;
    }
    const child: Child = { id: initial?.id ?? crypto.randomUUID(), name: name.trim() || 'Si kecil', dob };
    if (onProfile) onProfile(child, role);
    else update(current => ({ ...current, consent: true, role: current.role || role, children: initial ? current.children.map(item => item.id === initial.id ? child : item) : [...current.children, child], selected: child.id }));
    if (stageFor(months) === null) toast.info(t('Aktivitas Asah tersedia untuk anak di bawah 6 tahun.'));
    onDone();
  }}>
    <label className="field-label">{t('Nama panggilan ')}<span className="text-muted-foreground">{t('(opsional)')}</span><input className="field" value={name} maxLength={40} onChange={event => setName(event.target.value)} placeholder={t('Nama si kecil')} /></label>
    <label className="field-label">{t('Tanggal lahir')}<input className="field" type="date" required value={dob} onChange={event => setDob(event.target.value)} /></label>
    {askRole && <label className="field-label">{t('Saya adalah')}<select className="field" value={role} onChange={event => setRole(event.target.value)}>{caregiverRoles.map(item => <option key={item} value={item}>{t(item)}</option>)}</select></label>}
    <label className="flex items-start gap-3 text-sm text-muted-foreground"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} className="mt-1 accent-primary" />{t('Saya setuju menyimpan profil hanya di perangkat ini. Gunakan data fiktif untuk mencoba prototipe.')}</label>
    <Link to="/transparansi" className="text-sm text-primary underline">{t('Tentang data & sumber')}</Link>
    {error && <p role="alert" className="text-destructive text-sm">{t(error)}</p>}
    <Button type="submit" className="w-full" size="lg">{submitLabel ?? t(initial ? 'Simpan perubahan' : 'Mulai bersama')}<ArrowRight /></Button>
  </form>;
}
