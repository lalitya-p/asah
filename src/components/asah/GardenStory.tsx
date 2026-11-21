import { useEffect, useMemo, useState } from 'react';
import { Play, RotateCcw, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/asah/language';
import { GardenCanvas } from '@/components/asah/GardenCanvas';
import { AREAS, getActivity, type AreaId } from '@/data/asahActivities';
import type { Completion } from '@/lib/asah';
import { areaIds } from '@/lib/moments';
import { emptyGardenCounts, gardenCounts, gardenStory, GARDEN_STORY_MS, storyFrameIndex } from '@/lib/garden-story';

export function GardenStory({ moments }: { moments: Completion[] }) {
  const { language: lang, t, locale } = useLanguage();
  const frames = useMemo(() => gardenStory(moments), [moments]);
  const [status, setStatus] = useState<'idle' | 'playing' | 'done'>('idle');
  const [index, setIndex] = useState(-1);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (status !== 'playing') return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finish = () => setStatus('done');
    if (motion.matches) { finish(); return; }
    const started = performance.now();
    const timer = window.setInterval(() => {
      const elapsed = performance.now() - started;
      if (elapsed >= GARDEN_STORY_MS) finish();
      else setIndex(storyFrameIndex(elapsed, frames.length));
    }, 40);
    const onMotionChange = () => { if (motion.matches) finish(); };
    motion.addEventListener('change', onMotionChange);
    return () => { window.clearInterval(timer); motion.removeEventListener('change', onMotionChange); };
  }, [status, run, frames.length]);
  const frame = status === 'playing' ? frames[index] : undefined;
  const counts = status === 'playing' ? frame?.counts ?? emptyGardenCounts() : gardenCounts(moments);
  const labels = Object.fromEntries(areaIds.map(a => [a, AREAS[a].label[lang]])) as Record<AreaId, string>;
  const activityTitle = frame ? getActivity(frame.moment.activityId)?.title[lang] ?? t(frame.moment.title) : '';
  const loggedAt = frame ? new Date(frame.moment.at) : null;
  const activityDate = loggedAt && Number.isFinite(loggedAt.getTime())
    ? new Intl.DateTimeFormat(locale, { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'short', year: 'numeric' }).format(loggedAt)
    : '';
  const start = () => {
    setIndex(-1);
    setRun(n => n + 1);
    setStatus(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'done' : 'playing');
  };
  return <>
    <GardenCanvas counts={counts} labels={labels} highlight={frame?.areas ?? []} wateringKey={frame ? `${run}-${frame.moment.id}` : ''} onSelect={area => {
      if (status !== 'playing') document.getElementById(`area-${area}`)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
    }} />
    {moments.length > 0 && <div className="garden-story-controls">
      <p className="garden-story-caption"><span>{status === 'playing' ? activityTitle || (lang === 'en' ? 'Your garden begins…' : 'Tamanmu mulai tumbuh…') : status === 'done' ? (lang === 'en' ? 'Your garden today' : 'Tamanmu hari ini') : ''}</span>{frame && activityDate && <time className="garden-story-date" dateTime={frame.moment.at}>{activityDate}</time>}</p>
      <Button variant="secondary" className="garden-story-button" onClick={status === 'playing' ? () => setStatus('done') : start}>
        {status === 'playing' ? <SkipForward aria-hidden /> : status === 'done' ? <RotateCcw aria-hidden /> : <Play aria-hidden />}
        {status === 'playing' ? (lang === 'en' ? 'Skip' : 'Lewati') : status === 'done' ? (lang === 'en' ? 'Replay' : 'Putar ulang') : (lang === 'en' ? 'Play growth story' : 'Putar perjalanan taman')}
      </Button>
      <span className="sr-only" role="status">{status === 'done' ? (lang === 'en' ? 'Growth story complete. Your current garden is shown.' : 'Perjalanan taman selesai. Tamanmu saat ini ditampilkan.') : ''}</span>
    </div>}
  </>;
}