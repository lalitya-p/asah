import { useState } from 'react';
import { ArrowLeft, ArrowRight, Heart, Home, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/asah/language';
import { useAsah } from '@/components/asah/store';
import { ChildForm } from '@/components/asah/ChildForm';
import { DevelopmentJourney } from '@/components/asah/DevelopmentJourney';
import { HouseholdInventoryEditor } from '@/components/asah/HouseholdInventoryEditor';
import { ageMonths, sampleChild, stageFor, type Child, type InventoryEntry } from '@/lib/asah';

export function Onboarding() {
  const { language: lang } = useLanguage();
  const { update, now } = useAsah();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Child | null>(null);
  const [draftRole, setDraftRole] = useState('Ibu');
  const [items, setItems] = useState<InventoryEntry[]>([]);
  const stage = draft ? stageFor(ageMonths(draft.dob, now)) : null;

  const finish = (setupComplete: boolean) => {
    if (!draft) return;
    const status = setupComplete && items.length ? 'complete' : 'skipped';
    update(current => ({ ...current, children: [...current.children, draft], selected: draft.id, consent: true, role: current.role || draftRole, inventory: { status, items } }));
  };

  return <div className="onboarding">
    <div className="onboarding-top">{step > 1 && <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}><ArrowLeft />{lang === 'en' ? 'Back' : 'Kembali'}</Button>}<span>{lang === 'en' ? `Step ${step} of 5` : `Langkah ${step} dari 5`}</span></div>

    {step === 1 && <section className="onboarding-hero"><div className="start-icon"><Heart /></div><span className="eyebrow">{lang === 'en' ? 'WELCOME TO ASAH' : 'SELAMAT DATANG DI ASAH'}</span><h1>{lang === 'en' ? 'Why play matters.' : 'Kenapa bermain berarti.'}</h1><p>{lang === 'en' ? 'The first five years are a time of rapid change. Simple, shared play gives your child room to explore, connect, and try new things.' : 'Lima tahun pertama adalah masa penuh perubahan. Bermain bersama yang sederhana memberi anak ruang untuk mengeksplorasi, terhubung, dan mencoba hal baru.'}</p><div className="onboarding-points"><span><b>{lang === 'en' ? 'Connect' : 'Terhubung'}</b>{lang === 'en' ? 'Your attention is the starting point.' : 'Perhatianmu adalah titik awalnya.'}</span><span><b>{lang === 'en' ? 'Explore' : 'Mengeksplorasi'}</b>{lang === 'en' ? 'Everyday moments can become play.' : 'Momen sehari-hari bisa menjadi permainan.'}</span><span><b>{lang === 'en' ? 'No testing' : 'Tanpa menguji'}</b>{lang === 'en' ? 'Follow your child, not a score.' : 'Ikuti anakmu, bukan skor.'}</span></div><Button size="lg" onClick={() => setStep(2)}>{lang === 'en' ? 'Explore the journey' : 'Lihat perjalanannya'}<ArrowRight /></Button></section>}

    {step === 2 && <><DevelopmentJourney /><Button className="onboarding-next" size="lg" onClick={() => setStep(3)}>{lang === 'en' ? 'Add your child' : 'Tambah profil anak'}<ArrowRight /></Button></>}

    {step === 3 && <section className="onboarding-card"><span className="eyebrow">{lang === 'en' ? 'YOUR CHILD’S PLACE IN THE JOURNEY' : 'POSISI SI KECIL DALAM PERJALANAN'}</span><h1>{lang === 'en' ? 'Who are we playing with?' : 'Siapa yang akan bermain?'}</h1><p>{lang === 'en' ? 'We use completed months to place their age within the play framework. This is not a developmental assessment.' : 'Kami menggunakan bulan lengkap untuk menempatkan usia anak dalam kerangka bermain. Ini bukan penilaian perkembangan.'}</p><ChildForm onDone={() => {}} onProfile={(child, role) => { setDraft(child); setDraftRole(role); setStep(4); }} submitLabel={lang === 'en' ? 'See my child’s journey' : 'Lihat perjalanan si kecil'} /><div className="sample-profile"><span>{lang === 'en' ? 'Just exploring?' : 'Ingin mencoba dulu?'}</span><Button variant="outline" onClick={() => { setDraft(sampleChild(now)); setDraftRole('Ayah'); setStep(4); }}>{lang === 'en' ? 'Use a sample profile' : 'Coba profil contoh'}</Button></div></section>}

    {step === 4 && draft && <><div className="personalized-intro"><Sparkles /><div><span className="eyebrow">{lang === 'en' ? 'PERSONALIZED BY AGE' : 'DIPERSONALISASI BERDASARKAN USIA'}</span><h1>{lang === 'en' ? `${draft.name} has a place in the journey.` : `${draft.name} punya tempat dalam perjalanan ini.`}</h1><p>{lang === 'en' ? 'We will use this stage to suggest play. You can explore every stage, and the suggestions will change as your child grows.' : 'Kami akan menggunakan tahap ini untuk menyarankan permainan. Kamu dapat melihat semua tahap, dan saran akan berubah seiring anak bertumbuh.'}</p></div></div><DevelopmentJourney currentStage={stage} childName={draft.name} /><Button className="onboarding-next" size="lg" onClick={() => setStep(5)}>{lang === 'en' ? 'Set up household items' : 'Atur barang di rumah'}<Home /><ArrowRight /></Button></>}

    {step === 5 && <section className="onboarding-card"><span className="eyebrow">{lang === 'en' ? 'USE WHAT YOU ALREADY HAVE' : 'GUNAKAN YANG SUDAH ADA'}</span><h1>{lang === 'en' ? 'What can you play with at home?' : 'Apa yang bisa dipakai bermain di rumah?'}</h1><p>{lang === 'en' ? 'Select available items so every recommendation is ready to play. This one inventory is shared by all your children.' : 'Pilih barang yang tersedia agar setiap rekomendasi siap dimainkan. Satu daftar ini dipakai bersama untuk semua anak.'}</p><HouseholdInventoryEditor items={items} onChange={setItems} /><p className="inventory-skip-note">{lang === 'en' ? 'If you skip or select nothing, we will only suggest material-free activities.' : 'Jika dilewati atau tidak ada barang yang dipilih, kami hanya menyarankan aktivitas tanpa bahan.'}</p><div className="onboarding-finish"><Button size="lg" onClick={() => finish(true)}>{lang === 'en' ? 'Save items & start playing' : 'Simpan barang & mulai bermain'}<ArrowRight /></Button><Button variant="ghost" onClick={() => finish(false)}>{lang === 'en' ? 'Skip for now' : 'Lewati untuk sekarang'}</Button></div></section>}
  </div>;
}
