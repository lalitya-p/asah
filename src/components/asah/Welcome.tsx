import { useState } from 'react';
import { ArrowRight, Heart, ShieldCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/asah/language';
import { useAsah } from '@/components/asah/store';

export function Welcome() {
  const { t } = useLanguage();
  const { accounts, createSpace, signIn, now } = useAsah();
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'choose' | 'create'>('choose');
  const create = () => {
    createSpace(name);
    setName('');
  };
  return (
    <div className="welcome">
      <section className="welcome-hero">
        <span className="eyebrow">{t('UNTUK ANAK USIA 0–5 TAHUN')}</span>
        <h1>{t('Momen kecil, tumbuh bersama.')}</h1>
        <p>
          {t(
            'Asah menemani bermain sehari-hari dengan ide sederhana yang sesuai usia. Semua data tetap di perangkat ini.',
          )}
        </p>
        <div className="welcome-points">
          <span>
            <b>{t('Sesuai usia')}</b>
            {t('Ide bermain mengikuti tahap usia anak Anda.')}
          </span>
          <span>
            <b>{t('Tanpa skor')}</b>
            {t('Tidak ada penilaian, peringkat, atau perbandingan.')}
          </span>
          <span>
            <b>{t('Milik Anda')}</b>
            {t('Profil dan catatan bisa dihapus kapan saja.')}
          </span>
        </div>
      </section>

      {mode === 'choose' ? (
        <section className="welcome-card">
          <div className="welcome-choice">
            <Heart />
            <h2>{t('Baru di sini?')}</h2>
            <p>{t('Buat ruang keluarga, lalu perkenalkan diri Anda dan si kecil.')} </p>
            <Button size="lg" onClick={() => setMode('create')}>
              {t('Buat ruang keluarga')}
              <ArrowRight />
            </Button>
          </div>
          {accounts.length > 0 && (
            <div className="welcome-choice">
              <Users />
              <h2>{t('Sudah pernah pakai Asah?')}</h2>
              <p>{t('Pilih ruang keluarga yang tersimpan di perangkat ini.')}</p>
              <div className="space-list">
                {accounts.map(account => (
                  <Button key={account.id} variant="outline" className="space-option" onClick={() => signIn(account.id)}>
                    <span className="avatar">{account.name.charAt(0)}</span>
                    <span className="space-meta">
                      <span className="space-name">{account.name}</span>
                      <small>
                        {account.data.children.length
                          ? `${t('Profil anak: ')}${account.data.children.length}`
                          : t('Belum ada profil anak')}
                      </small>
                    </span>
                    <ArrowRight />
                  </Button>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="welcome-card">
          <h2>{t('Sebut ruang keluarga ini')}</h2>
          <p>{t('Nama ini hanya muncul di perangkat ini, untuk membedakan ruang jika ada lebih dari satu.')}</p>
          <label className="field-label">
            {t('Nama ruang')}
            <input
              className="field"
              value={name}
              maxLength={40}
              placeholder={t('Keluarga kami')}
              onChange={event => setName(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter') create();
              }}
            />
          </label>
          <Button size="lg" className="welcome-full" onClick={create}>
            {t('Buat & mulai')}
            <ArrowRight />
          </Button>
          <Button variant="ghost" onClick={() => setMode('choose')}>
            {t('Kembali')}
          </Button>
        </section>
      )}

      <p className="welcome-foot">
        <ShieldCheck size={15} />
        {t('Prototipe. Tidak ada akun, kata sandi, atau sinkronisasi ke layanan lain.')}
      </p>
    </div>
  );
}
