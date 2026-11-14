import { useEffect, useId, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, ChevronLeft, ChevronRight, Sprout } from 'lucide-react';
import { AREAS, type Activity, type Lang } from '@/data/asahActivities';

const copy = {
  heading: { id: 'Ide main malam ini', en: 'Play ideas for tonight' },
  swipe: { id: 'Geser untuk lainnya', en: 'Swipe for more' },
  of: { id: 'dari', en: 'of' },
  min: { id: 'MENIT', en: 'MIN' },
  helps: { id: 'Cara membantu tumbuh kembang', en: 'How it helps development' },
  cta: { id: 'Ayo main', en: "Let's play" },
  previous: { id: 'Aktivitas sebelumnya', en: 'Previous activity' },
  next: { id: 'Aktivitas berikutnya', en: 'Next activity' },
  goTo: { id: 'Buka aktivitas', en: 'Go to activity' },
  slide: { id: 'aktivitas', en: 'activity' },
  empty: { id: 'Ide main untuk kelompok usia ini segera hadir.', en: 'Play ideas for this age group are coming soon.' },
};

export function ActivityCarousel({ activities, lang }: { activities: Activity[]; lang: Lang }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const trackId = useId();
  const [active, setActive] = useState(0);
  const activityKey = activities.map(activity => activity.id).join('|');

  useEffect(() => {
    setActive(0);
    if (trackRef.current) trackRef.current.scrollLeft = 0;
  }, [activityKey]);

  function goTo(index: number) {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: reducedMotion ? 'auto' : 'smooth' });
    setActive(index);
  }

  function updateActive() {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const closest = cards.reduce((best, card, index) => {
      const distance = Math.abs(card.offsetLeft - track.offsetLeft - track.scrollLeft);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Number.POSITIVE_INFINITY });
    setActive(current => current === closest.index ? current : closest.index);
  }

  return (
    <section aria-label={copy.heading[lang]} aria-roledescription="carousel" className="dev-carousel">
      <div className="dev-row-head"><h2>{copy.heading[lang]}</h2>{activities.length > 1 && <span>{copy.swipe[lang]}</span>}</div>
      {activities.length ? <>
        <div id={trackId} ref={trackRef} className="dev-track" onScroll={updateActive} tabIndex={0} aria-label={copy.heading[lang]}>
          {activities.map((activity, index) => (
            <article
              key={activity.id}
              className="dev-card"
              style={{ background: activity.theme.bg }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} ${copy.of[lang]} ${activities.length}: ${activity.title[lang]}`}
            >
              <div className="dev-kicker" style={{ color: activity.theme.accent }}>{index + 1} {copy.of[lang].toUpperCase()} {activities.length} · {activity.minutes} {copy.min[lang]}</div>
              <span className="dev-type">{activity.category[lang]}</span>
              <h3>{activity.title[lang]}</h3>
              <p className="dev-description">{activity.description[lang]}</p>
              <div className="dev-benefit">
                <span><Sprout size={15} aria-hidden />{copy.helps[lang]}</span>
                <p>{activity.benefit[lang]}</p>
              </div>
              <div className="dev-chips" aria-label={copy.helps[lang]}>{activity.areas.map(id => <span key={id}>{AREAS[id].label[lang]}</span>)}</div>
              <Link to="/aktivitas/$id" params={{ id: activity.id }} className="dev-cta" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>{copy.cta[lang]}<ArrowRight size={17} aria-hidden /></Link>
            </article>
          ))}
        </div>
        {activities.length > 1 && <div className="dev-carousel-controls">
          <button type="button" className="dev-carousel-arrow" aria-label={copy.previous[lang]} aria-controls={trackId} disabled={active === 0} onClick={() => goTo(active - 1)}><ChevronLeft aria-hidden /></button>
          <div className="dev-dots" aria-label={`${active + 1} ${copy.of[lang]} ${activities.length}`}>
            {activities.map((activity, index) => <button key={activity.id} type="button" className={index === active ? 'dev-dot active' : 'dev-dot'} aria-label={`${copy.goTo[lang]} ${index + 1}: ${activity.title[lang]}`} aria-current={index === active ? 'true' : undefined} aria-controls={trackId} onClick={() => goTo(index)}><span /></button>)}
          </div>
          <button type="button" className="dev-carousel-arrow" aria-label={copy.next[lang]} aria-controls={trackId} disabled={active === activities.length - 1} onClick={() => goTo(active + 1)}><ChevronRight aria-hidden /></button>
        </div>}
      </> : <p className="dev-empty">{copy.empty[lang]}</p>}
    </section>
  );
}
