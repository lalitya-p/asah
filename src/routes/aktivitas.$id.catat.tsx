import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useLanguage } from '@/components/asah/language';
import { useAsah } from '@/components/asah/store';
import { StartGate } from '@/components/asah/shared';
import { AREAS, NOTICE_OPTIONS, getActivity } from '@/data/asahActivities';
import { addCompletion, ageMonths, stageFor } from '@/lib/asah';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/aktivitas/$id/catat')({ head: () => pageHead('Catat momen', 'Catat apa yang kamu perhatikan saat bermain. Tidak ada jawaban yang salah.'), component: LogMoment });

const copy = {
  back: { id: 'Kembali', en: 'Back' }, kicker: { id: 'MAIN MALAM INI', en: "TONIGHT'S PLAY" },
  question: { id: 'Bagaimana', en: 'How did' }, question2: { id: 'tadi?', en: 'go?' },
  sub: { id: 'Pilih yang kamu perhatikan. Tidak ada jawaban yang salah.', en: "Pick what you noticed. There's no right answer." },
  note: { id: 'Ada yang ingin diingat? (opsional)', en: "Anything you'd like to remember? (optional)" },
  savedUnder: { id: 'Disimpan di', en: 'Saved under' }, and: { id: 'dan', en: 'and' },
  save: { id: 'Simpan momen ini', en: 'Save this moment' }, saved: { id: 'MOMEN TERSIMPAN', en: 'MOMENT SAVED' },
  youNoticed: { id: 'Kamu memperhatikan:', en: 'You noticed:' },
  present: { id: 'Apa pun yang terjadi malam ini, kamu ada di sana.', en: 'Whatever happened tonight, you were there for it.' },
  backDev: { id: 'Kembali ke Perkembangan', en: 'Back to Development' }, another: { id: 'Catat momen lain', en: 'Log another moment' },
};

function LogMoment() {
  const { id } = Route.useParams();
  const { language: lang } = useLanguage();
  const { child, update, now } = useAsah();
  const a = getActivity(id);
  const [choice, setChoice] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  if (!a) return <div className="dev-page"><Link to="/perkembangan" className="dev-back">← {copy.back[lang]}</Link></div>;
  const areaNames = a.areas.map(x => AREAS[x].label[lang]).join(` ${copy.and[lang]} `);
  const save = () => {
    if (choice === null || !child) return;
    update(s => ({ ...s, logs: addCompletion(s.logs, { id: crypto.randomUUID(), childId: child.id, activityId: a.id, title: a.title.id, focus: a.areas.map(x => AREAS[x].label.id).join(' · '), stage: stageFor(ageMonths(child.dob, now)) ?? 0, duration: a.minutes, at: new Date().toISOString(), noticed: choice, areas: a.areas, ...(note.trim() ? { note: note.trim() } : {}) }) }));
    setSaved(true);
  };
  return <StartGate><div className="dev-page">
    <Link to="/aktivitas/$id" params={{ id: a.id }} className="dev-back">← {copy.back[lang]}</Link>
    {!saved ? <>
      <section className="dev-detail-head"><div className="dev-kicker" style={{ color: a.theme.accent }}>{copy.kicker[lang]}</div><h1>{copy.question[lang]} {a.title[lang]} {copy.question2[lang]}</h1><p>{copy.sub[lang]}</p></section>
      <div role="group" className="dev-options">{NOTICE_OPTIONS.map((o, i) => <button key={o.id} type="button" aria-pressed={choice === i} onClick={() => setChoice(i)}>{o[lang]}</button>)}</div>
      <label className="field-label">{copy.note[lang]}<textarea rows={2} value={note} maxLength={300} onChange={e => setNote(e.target.value)} className="field" /></label>
      <p className="dev-saved-under">{copy.savedUnder[lang]} <b>{areaNames}</b></p>
      <button type="button" onClick={save} disabled={choice === null} className="dev-primary">{copy.save[lang]}</button>
    </> : <div className="dev-done">
      <div className="dev-kicker">{copy.saved[lang]}</div>
      <h1>{copy.youNoticed[lang]} {NOTICE_OPTIONS[choice ?? 0]?.[lang].toLowerCase()}</h1>
      <p>{a.why[lang]} {copy.present[lang]}</p>
      <Link to="/perkembangan" className="dev-primary">{copy.backDev[lang]}</Link>
      <button type="button" className="dev-link" onClick={() => { setChoice(null); setNote(''); setSaved(false); }}>{copy.another[lang]}</button>
    </div>}
  </div></StartGate>;
}
