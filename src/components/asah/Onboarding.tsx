import { ArrowLeft, ArrowRight, Home, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/asah/language';
import { useAsah } from '@/components/asah/store';
import { ChildForm } from '@/components/asah/ChildForm';
import { DevelopmentJourney } from '@/components/asah/DevelopmentJourney';
import { HouseholdInventoryEditor } from '@/components/asah/HouseholdInventoryEditor';
import { ageMonths, caregiverRoles, sampleChild, stageFor } from '@/lib/asah';
import { ONBOARDING_STEP_COUNT, roleForOnboarding } from '@/lib/account';

// Four setup screens lead directly to the homepage, the fifth stage. The role,
// child draft and household draft stay on the account across interrupted visits.
export function Onboarding() {
  const { t, language: lang } = useLanguage();
  const { state, now, onboarding, patchOnboarding, saveRole, finish } = useAsah();
  const draft = onboarding.draftChild;
  const items = onboarding.draftItems;
  const requestedStep = Math.min(onboarding.step, ONBOARDING_STEP_COUNT - 1);
  // The personalized journey and inventory need a child. A missing role always
  // returns to step 1 without discarding either draft.
  const step = !state.role ? 1 : draft || requestedStep < 3 ? requestedStep : 2;
  const stage = draft ? stageFor(ageMonths(draft.dob, now)) : null;
  const role = roleForOnboarding(state.role);
  const label = lang === 'en' ? `Step ${step} of ${ONBOARDING_STEP_COUNT}` : `Langkah ${step} dari ${ONBOARDING_STEP_COUNT}`;
  const go = (next: number) => patchOnboarding({ step: next });
  const continueWithRole = () => {
    saveRole(role);
    go(2);
  };

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
            <select className="field" value={role} onChange={event => saveRole(event.target.value)}>
              {caregiverRoles.map(item => (
                <option key={item} value={item}>
                  {t(item)}
                </option>
              ))}
            </select>
          </label>
          <Button className="onboarding-next" size="lg" onClick={continueWithRole}>
            {t('Tambah profil anak')}
            <ArrowRight />
          </Button>
        </section>
      )}

      {step === 2 && (
        <section className="onboarding-card">
          <span className="eyebrow">{t('PROFIL ANAK')}</span>
          <h1>{t('Siapa yang akan bermain?')}</h1>
          <p>
            {t(
              'Kami menggunakan bulan lengkap untuk menempatkan usia anak dalam kerangka bermain. Ini bukan penilaian perkembangan.',
            )}
          </p>
          <ChildForm
            initial={draft ?? undefined}
            allowRoleQuestion={false}
            onDone={() => {}}
            onProfile={child => patchOnboarding({ draftChild: child, step: 3 })}
            submitLabel={t('Lihat perjalanan si kecil')}
          />
          <div className="sample-profile">
            <span>{t('Ingin mencoba dulu?')}</span>
            <Button variant="outline" onClick={() => patchOnboarding({ draftChild: sampleChild(now), step: 3 })}>
              {t('Coba profil contoh')}
            </Button>
          </div>
        </section>
      )}

      {step === 3 && draft && (
        <>
          <div className="personalized-intro">
            <Sparkles />
            <div>
              <span className="eyebrow">{t('DIPERSONALISASI BERDASARKAN USIA')}</span>
              <h1>{draft.name}{t(' punya tempat dalam perjalanan ini.')}</h1>
              <p>
                {t(
                  'Lima tahun pertama penuh perubahan. Tahap usia ini membantu kami menyarankan permainan sederhana untuk mengeksplorasi, terhubung, dan mencoba hal baru—tanpa menilai perkembangan.',
                )}
              </p>
            </div>
          </div>
          <DevelopmentJourney currentStage={stage} childName={draft.name} inlineTheory />
          <Button className="onboarding-next" size="lg" onClick={() => go(4)}>
            {t('Atur barang di rumah')}
            <Home />
            <ArrowRight />
          </Button>
        </>
      )}

      {step === 4 && draft && (
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
            {t('Jika dilewati atau tidak ada barang yang dipilih, kami hanya menyarankan aktivitas tanpa bahan.')}
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
    </div>
  );
}
