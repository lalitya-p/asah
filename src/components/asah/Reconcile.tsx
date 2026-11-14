import { ArrowRight, ShieldCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/asah/language';
import { useAsah } from '@/components/asah/store';
import { reconcileSummary } from '@/lib/account';
import { ageLabel } from '@/lib/asah';

// One-time reconciliation for data that existed before family spaces existed.
// Nothing is marked finished without the person confirming what was found.
export function Reconcile() {
  const { t } = useLanguage();
  const { account, now, confirmData, createSpace } = useAsah();
  if (!account) return null;
  const summary = reconcileSummary(account.data, now);
  return (
    <div className="reconcile">
      <span className="eyebrow">{t('SEBELUM MULAI')}</span>
      <h1>{t('Apakah ini ruang keluarga Anda?')}</h1>
      <p>
        {t(
          'Kami menemukan data lama yang tersimpan di perangkat ini. Periksa isinya sebelum dipakai. Tidak ada yang dihapus atau disalin sampai Anda memilih.',
        )}
      </p>
      <div className="reconcile-card">
        <div className="reconcile-row">
          <span>{t('Ruang')}</span>
          <strong>{account.name}</strong>
        </div>
        <div className="reconcile-row">
          <span>{t('Profil anak')}</span>
          <strong>
            {summary.children.length
              ? summary.children.map(child => `${child.name} · ${ageLabel(child.months)}`).join(' · ')
              : t('Belum ada')}
          </strong>
        </div>
        <div className="reconcile-row">
          <span>{t('Catatan bermain')}</span>
          <strong>{summary.logs}</strong>
        </div>
        <div className="reconcile-row">
          <span>{t('Aktivitas tersimpan')}</span>
          <strong>{summary.saved}</strong>
        </div>
        <div className="reconcile-row">
          <span>{t('Barang di rumah')}</span>
          <strong>{summary.items}</strong>
        </div>
        <div className="reconcile-row">
          <span>{t('Peran pengasuh')}</span>
          <strong>{summary.role ? t(summary.role) : t('Belum diisi')}</strong>
        </div>
      </div>
      {!summary.evidence && (
        <p className="inventory-skip-note">
          {t(
            'Data ini belum lengkap, jadi perkenalan tahap perkembangan akan dilanjutkan dari awal, bukan dilewati.',
          )}
        </p>
      )}
      <div className="reconcile-actions">
        <Button size="lg" onClick={confirmData}>
          {t('Ya, ini ruang saya')}
          <ArrowRight />
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            createSpace('');
          }}
        >
          {t('Bukan punya saya — buat ruang baru')}
        </Button>
      </div>
      <p className="welcome-foot">
        <ShieldCheck size={15} />
        {t('Ruang lama tetap tersimpan di perangkat ini dan bisa dibuka lagi kapan saja.')}
      </p>
      <p className="tiny-note">
        <Trash2 size={13} />
        {t('Untuk menghapusnya permanen, buka Pengaturan lalu Hapus semua data.')}
      </p>
    </div>
  );
}
