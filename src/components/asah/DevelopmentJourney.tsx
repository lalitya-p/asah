import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/components/asah/language';
import { stages } from '@/lib/catalog';

export function DevelopmentJourney({ currentStage, childName, inlineTheory = false }: {
  currentStage?: number | null;
  childName?: string;
  inlineTheory?: boolean;
}) {
  const { t, language: lang } = useLanguage();
  const [openTheory, setOpenTheory] = useState<number | null>(null);
  return <section className="journey" aria-label={lang === 'en' ? 'Five-stage developmental journey' : 'Perjalanan perkembangan lima tahap'}>
    <header className="journey-heading">
      <span className="eyebrow">{lang === 'en' ? 'THE FIRST FIVE YEARS' : 'LIMA TAHUN PERTAMA'}</span>
      <h2>{lang === 'en' ? 'A journey, not a checklist.' : 'Sebuah perjalanan, bukan daftar centang.'}</h2>
      <p>{lang === 'en' ? 'Explore how play can meet your child at each age. These groups organize play ideas; they do not assess development.' : 'Lihat bagaimana bermain dapat menemani anak di setiap usia. Kelompok ini menata ide bermain, bukan menilai perkembangan.'}</p>
    </header>
    <div className="journey-track">
      {stages.map(stage => {
        const current = currentStage === stage.id;
        const expanded = openTheory === stage.id;
        return <article key={stage.id} className={`journey-stage${current ? ' current' : ''}`}>
          <span className="journey-marker" aria-hidden="true" />
          <div className="journey-stage-body">
            <div className="journey-stage-top"><span>{t(stage.label)}</span>{current && <strong>{lang === 'en' ? `${childName || 'Your child'} is here` : `${childName || 'Si kecil'} di sini`}</strong>}</div>
            <h3>{t(stage.name)}</h3>
            <div className="journey-focus">{stage.focus.map(item => <span key={item}>{t(item)}</span>)}</div>
            <p><b>{lang === 'en' ? 'Play connection: ' : 'Kaitan dengan bermain: '}</b>{t(stage.tonight)}</p>
            {inlineTheory ? (
              <div className="journey-theory journey-theory-inline">
                <b>{lang === 'en' ? 'Theoretical foundation' : 'Dasar teori'}</b>
                <span>{t(stage.theory)}</span>
                <p>{t(stage.theorySummary)}</p>
              </div>
            ) : (
              <>
                <button type="button" className="journey-theory-toggle" aria-expanded={expanded} aria-controls={`theory-${stage.id}`} onClick={() => setOpenTheory(expanded ? null : stage.id)}>
                  {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}{lang === 'en' ? 'Theoretical foundation' : 'Dasar teori'}
                </button>
                {expanded && <p id={`theory-${stage.id}`} className="journey-theory">{t(stage.theory)}</p>}
              </>
            )}
          </div>
        </article>;
      })}
    </div>
  </section>;
}
