import { Link } from '@tanstack/react-router';
import { AREAS, type Activity, type Lang } from '@/data/asahActivities';

const copy = {
  heading: { id: 'Ide main malam ini', en: 'Play ideas for tonight' },
  swipe: { id: 'Geser untuk lainnya', en: 'Swipe for more' },
  of: { id: 'dari', en: 'of' },
  min: { id: 'MENIT', en: 'MIN' },
  cta: { id: 'Ayo main', en: "Let's play" },
  empty: { id: 'Ide main untuk kelompok usia ini segera hadir.', en: 'Play ideas for this age group are coming soon.' },
};

export function ActivityCarousel({ activities, lang }: { activities: Activity[]; lang: Lang }) {
  return (
    <section aria-label={copy.heading[lang]} className="dev-carousel">
      <div className="dev-row-head"><h2>{copy.heading[lang]}</h2>{activities.length > 1 && <span>{copy.swipe[lang]}</span>}</div>
      {activities.length ? (
        <div className="dev-track">
          {activities.map((a, i) => (
            <article key={a.id} className="dev-card" style={{ background: a.theme.bg }}>
              <div className="dev-kicker" style={{ color: a.theme.accent }}>{i + 1} {copy.of[lang].toUpperCase()} {activities.length} · {a.minutes} {copy.min[lang]}</div>
              <h3>{a.title[lang]}</h3>
              <p>{a.description[lang]}</p>
              <div className="dev-chips">{a.areas.map(id => <span key={id}>{AREAS[id].label[lang]}</span>)}</div>
              <Link to="/aktivitas/$id" params={{ id: a.id }} className="dev-cta">{copy.cta[lang]} →</Link>
            </article>
          ))}
        </div>
      ) : <p className="dev-empty">{copy.empty[lang]}</p>}
    </section>
  );
}
