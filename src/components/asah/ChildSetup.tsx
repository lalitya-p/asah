import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '@/components/asah/language';
import { useAsah } from '@/components/asah/store';
import { ChildForm } from '@/components/asah/shared';

// Recovery for a finished space that no longer has a child profile, for example
// after the last profile was deleted. Onboarding is not replayed.
export function ChildSetup() {
  const { t } = useLanguage();
  const { account, addExistingChild } = useAsah();
  return (
    <div className="setup-child">
      <div className="personalized-intro">
        <Sparkles />
        <div>
          <span className="eyebrow">{t('RUANG KELUARGA ANDA')}</span>
          <h1>{t('Belum ada profil anak di sini.')}</h1>
          <p>
            {t(
              'Perkenalan tahap perkembangan sudah selesai, jadi kami tidak akan menayakannya lagi. Cukup tambahkan anak untuk melanjutkan.',
            )}
          </p>
        </div>
      </div>
      <section className="welcome-card">
        <h2>{t('Kenalan dengan si kecil')}</h2>
        <p>
          {account?.data.role
            ? t('Peran pengasuh dan daftar barang di rumah tetap sama seperti sebelumnya.')
            : t('Isi profil anak untuk mulai bermain.')}
        </p>
        <ChildForm onDone={() => {}} onProfile={child => addExistingChild(child)} submitLabel={t('Lanjutkan')} />
      </section>
      <p className="welcome-foot">
        <ShieldCheck size={15} />
        {t('Data hanya disimpan di perangkat ini. Gunakan data fiktif untuk mencoba prototipe.')}
      </p>
    </div>
  );
}
