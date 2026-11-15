import { createFileRoute, Link } from '@tanstack/react-router';
import { useLanguage } from '@/components/asah/language';
import { AREAS, getActivity } from '@/data/asahActivities';
import { useAsah } from '@/components/asah/store';
import { evaluateMaterials, missingMaterialLabels, requirementLabel } from '@/lib/inventory';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/aktivitas/$id/')({ head: ({ params }) => pageHead(getActivity(params.id)?.title.id ?? 'Aktivitas', 'Cara main langkah demi langkah bersama si kecil.'), component: ActivityPage });

const copy = {
  back: { id: 'Kembali ke Hari ini', en: 'Back to Today' }, tonight: { id: 'AKTIVITAS HARI INI', en: "TODAY'S PLAY" }, min: { id: 'MENIT', en: 'MIN' },
  how: { id: 'Cara main', en: 'How to play' }, why: { id: 'Kenapa ini membantu', en: 'Why it helps' },
  anyReaction: { id: 'Semua reaksi tidak apa-apa, termasuk hanya memperhatikan.', en: 'Every reaction is fine, even just watching.' },
  log: { id: 'Catat hasilnya', en: 'Log how it went' }, notFound: { id: 'Aktivitas tidak ditemukan.', en: 'Activity not found.' },
};

function ActivityPage() {
  const { id } = Route.useParams();
  const { language: lang } = useLanguage();
  const { state } = useAsah();
  const a = getActivity(id);
  const eligibility = a ? evaluateMaterials(a, state.inventory) : undefined;
  return <div className="dev-page">
    <Link to="/" className="dev-back">← {copy.back[lang]}</Link>
    {!a ? <p>{copy.notFound[lang]}</p> : <>
      <section className="dev-detail-head">
        <div className="dev-kicker" style={{ color: a.theme.accent }}>{copy.tonight[lang]} · {a.minutes} {copy.min[lang]}</div>
        <h1>{a.title[lang]}</h1><p>{a.description[lang]}</p>
        <div className="dev-chips">{a.areas.map(x => <span key={x} style={{ background: a.theme.bg }}>{AREAS[x].label[lang]}</span>)}</div>
      </section>
      <section className="dev-materials"><h2>{lang === 'en' ? 'What you need' : 'Yang dibutuhkan'}</h2>{a.materialFree ? <p>{lang === 'en' ? 'No household items needed.' : 'Tanpa barang dari rumah.'}</p> : <ul>{a.requiredMaterials.map(requirement => <li key={requirement.itemId}>{requirementLabel(requirement, lang)}</li>)}</ul>}{a.optionalMaterials.length > 0 && <p>{lang === 'en' ? 'Optional: ' : 'Opsional: '}{a.optionalMaterials.map(requirement => requirementLabel(requirement, lang)).join(', ')}</p>}{eligibility && !eligibility.eligible && <div className="inventory-notice"><strong>{lang === 'en' ? 'Missing materials' : 'Bahan belum lengkap'}</strong><p>{eligibility.missing.length ? missingMaterialLabels(eligibility.missing, lang).join(', ') : (lang === 'en' ? 'Finish household inventory setup to check this activity.' : 'Selesaikan pengaturan barang untuk memeriksa aktivitas ini.')}</p><Link to="/pengaturan">{lang === 'en' ? 'Update household items' : 'Perbarui barang di rumah'}</Link></div>}</section>
      <section aria-label={copy.how[lang]} className="dev-steps"><h2>{copy.how[lang]}</h2>
        {a.steps.map((s, i) => <div key={i} className="dev-step" style={{ background: a.theme.bg }}>
          {s.image ? <img src={s.image} alt={s.alt?.[lang] ?? s.title[lang]} loading="lazy" width={100} height={92} /> : <div className="dev-step-num" style={{ color: a.theme.accent }} aria-hidden>{i + 1}</div>}
          <div><b>{i + 1}. {s.title[lang]}</b><p>{s.text[lang]}</p></div>
        </div>)}
      </section>
      {a.safety && <p className="dev-safety">{a.safety[lang]}</p>}
      <section className="dev-why"><h2>{copy.why[lang]}</h2><p>{a.why[lang]}</p><p>{copy.anyReaction[lang]}</p></section>
      <Link to="/aktivitas/$id/catat" params={{ id: a.id }} className="dev-primary">{copy.log[lang]}</Link>
    </>}
  </div>;
}
