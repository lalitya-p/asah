import { ArrowLeft, ArrowRight, Check, Heart, Home, Sparkles } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/asah/language';
import { useAsah } from '@/components/asah/store';
import { ChildForm } from '@/components/asah/ChildForm';
import { DevelopmentJourney } from '@/components/asah/DevelopmentJourney';
import { HouseholdInventoryEditor } from '@/components/asah/HouseholdInventoryEditor';
import { ageMonths, caregiverRoles, sampleChild, stageFor } from '@/lib/asah';
import { ONBOARDING_STEP_COUNT } from '@/lib/account';

// Six steps, in the order a caregiver would actually want them. Progress and
// the half-typed child live on the account, so a refresh resumes here.
export function Onboarding() {
  const { t, language: lang } = useLanguage();
  const navigate = useNavigate();
  const { state, now, onboarding, patchOnboarding, saveRole, finish } = useAsah();
  const draft = onboarding.draftChild;
  const items = onboarding.draftItems;
  // Steps 4 and 5 need a child; without one, the child step is the real place.
  const step = draft || onboarding.step < 4 ? onboarding.step : 3;
  const stage = draft ? stageFor(ageMonths(draft.dob, now)) : null;
  const label = lang === 'en' ? `Step ${step} of ${ONBOARDING_STEP_COUNT}` : `Langkah ${step} dari ${ONBOARDING_STEP_COUNT}`;
  const go = (next: number) => patchOnboarding({ step: next });

  return (
    <div className="onboarding">
      <div className="onboarding-top">
        {step > 1 ? (
          <Button variant="ghost" size="sm" onClick={() => go(step - 1)}>
            <ArrowLeft />
            {t('Kembali')}
          </Button>
        ) : (
          <span />
        )}
        <span>{label}</span>
      </div>
      <div className="onboarding-progress" aria-hidden="true">
        <span style={{ width: `${(step / ONBOARDING_STEP_COUNT) * 100}%` }} />
      </div>

      {step === 1 && (
        <>
          <section className="onboarding-hero">
            <div className="start-icon">
              <Heart />
            </div>
            <span className="eyebrow">{t('SELAMAT DATANG DI ASAH')}</span>
            <h1>{t('Kenapa bermain berarti.')}</h1>
            <p>
              {t(
                'Lima tahun pertama adalah masa penuh perubahan. Bermain bersama yang sederhana memberi anak ruang untuk mengeksplorasi, terhubung, dan mencoba hal baru.',
              )}
            </p>
            <div className="onboarding-points">
              <span>
                <b>{t('Terhubung')}</b>
                {t('Perhatianmu adalah titik awalnya.')}
              </span>
              <span>
                <b>{t('Mengeksplorasi')}</b>
                {t('Momen sehari-hari bisa menjadi permainan.')}
              </span>
              <span>
                <b>{t('Tanpa menguji')}</b>
                {t('Ikuti anakmu, bukan skor.')}
              </span>
            </div>
          </section>
          <DevelopmentJourney />
          <Button className="onboarding-next" size="lg" onClick={() => go(2)}>
            {t('Ceritakan tentang Anda')}
            <ArrowRight />
          </Button>
        </>
      )}

      {step === 2 && (
        <section className="onboarding-card">
          <span className="eyebrow">{t('SIAPA YANG AKAN BERMAIN')}</span>
          <h1>{t('Anda berperan sebagai apa?')}</h1>
          <p>
            {t(
              'Kami menanyakannya sekali di sini. Peran ini berlaku untuk semua anak di ruang keluarga ini, dan bisa diubah di Pengaturan.',
            )}
          </p>
          <label className="field-label">
            {t('Saya adalah')}
            <select
              className="field"
              value={state.role || 'Ibu'}
              onChange={event => saveRole(event.target.value)}
            >
              {caregiverRoles.map(role => (
                <option key={role} value={role}>
                  {t(role)}
                </option>
              ))}
            </select>
          </label>
          <Button className="onboarding-next" size="lg" onClick={() => go(3)}>
            {t('Tambah profil anak')}
            <ArrowRight />
          </Button>
        </section>
      )}

      {step === 3 && (
        <section className="onboarding-card">
          <span className="eyebrow">{t('PROFIL ANAK')}</span>
          <h1>{t('Siapa yang akan bermain?')}</h1>
          <p>
            {t(
              'Kami menggunakan bulan lengkap untuk menempatkan usia anak dalam kerangka bermain. Ini bukan penilaian perkembangan.',
            )}
          </p>
          <ChildForm onDone={() => {}} onProfile={child => patchOnboarding({ draftChild: child, step: 4 })} submitLabel={t('Lihat perjalanan si kecil')} />
          <div className="sample-profile">
            <span>{t('Ingin mencoba dulu?')}</span>
            <Button variant="outline" onClick={() => patchOnboarding({ draftChild: sampleChild(now), step: 4 })}>
              {t('Coba profil contoh')}
            </Button>
          </div>
        </section>
      )}

      {step === 4 && draft && (
        <>
          <div className="personalized-intro">
            <Sparkles />
            <div>
              <span className="eyebrow">{t('DIPERSONALISASI BERDASARKAN USIA')}</span>
              <h1>{t(`${draft.name} punya tempat dalam perjalanan ini.`)}</h1>
              <p>
                {t(
                  'Kami akan menggunakan tahap ini untuk menyarankan permainan. Kamu dapat melihat semua tahap, dan saran akan berubah seiring anak bertumbuh.',
                )}
              </p>
            </div>
          </div>
          <DevelopmentJourney currentStage={stage} childName={draft.name} />
          <Button className="onboarding-next" size="lg" onClick={() => go(5)}>
            {t('Atur barang di rumah')}
            <Home />
            <ArrowRight />
          </Button>
        </>
      )}

      {step === 5 && draft && (
        <section className="onboarding-card">
          <span className="eyebrow">{t('GUNAKAN YANG SUDAH ADA')}</span>
          <h1>{t('Apa yang bisa dipakai bermain di rumah?')}</h1>
          <p>
            {t(
              'Pilih barang yang tersedia agar setiap rekomendasi siap dimainkan. Satu daftar ini dipakai bersama untuk semua anak.',
            )}
          </p>
          <HouseholdInventoryEditor items={items} onChange={next => patchOnboarding({ draftItems: next })} />
          <p className="inventory-skip-note">
            {t(
              'Jika dilewati atau tidak ada barang yang dipilih, kami hanya menyarankan aktivitas tanpa bahan.',
            )}
          </p>
          <div className="onboarding-finish">
            <Button size="lg" onClick={() => finish(draft, items, false)}>
              {t('Simpan barang & mulai bermain')}
              <ArrowRight />
            </Button>
            <Button variant="ghost" onClick={() => finish(draft, [], true)}>
              {t('Lewati untuk sekarang')}
            </Button>
          </div>
        </section>
      )}

      {step === ONBOARDING_STEP_COUNT && (
        <section className="onboarding-card">
          <div className="start-icon">
            <Check />
          </div>
          <h1>{t('Semua siap.')}</h1>
          <p>{t('Ruang keluarga Anda sudah jadi. Mari lihat ide bermain hari ini.')}</p>
          <Button
            className="onboarding-next"
            size="lg"
            onClick={() => navigate({ to: '/' })}
          >
            {t('Ke halaman hari ini')}
            <ArrowRight />
          </Button>
        </section>
      )}
    </div>
  );
}
