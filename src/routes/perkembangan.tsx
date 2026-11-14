import { createFileRoute } from '@tanstack/react-router';
import { useLanguage } from '@/components/asah/language';
import { useAsah } from '@/components/asah/store';
import { ActivityCarousel } from '@/components/asah/ActivityCarousel';
import { AreaIcon } from '@/components/asah/area-icon';
import { AREAS, NOTICE_OPTIONS, getActivity } from '@/data/asahActivities';
import { activitiesForAge, ageGroupLabel, areaIds, childMoments, gardenHasGrowth, momentsInArea } from '@/lib/moments';
import { ageMonths } from '@/lib/asah';
import { pageHead } from '@/lib/page-head';
import garden from '@/assets/asah/garden.svg.asset.json';
import gardenSeeds from '@/assets/asah/garden-seeds.svg';

export const Route = createFileRoute('/perkembangan')({ head: () => pageHead('Perkembangan', 'Ide main sesuai kelompok usia Buku KIA dan momen yang kamu perhatikan, tanpa penilaian.'), component: Development });

const copy = {
  tagline: { id: 'Pahami, jangan bandingkan.', en: "Understand, don't compare." },
  noticed: { id: 'Yang kamu perhatikan', en: "What you've noticed" },
  none: { id: 'Belum ada momen', en: 'No moments yet' },
  over: { id: 'Ide main tersedia untuk anak di bawah 6 tahun.', en: 'Play ideas are available for children under 6.' },
};

function Development() {
  const { language: lang } = useLanguage();
  const { child, state, now } = useAsah();
  const months = ageMonths(child?.dob ?? '', now);
  const moments = childMoments(state.logs, child?.id);
  const name = child?.name ?? '';
  const inRange = months >= 0 && months < 72;
  return <div className="dev-page">
    <header className="dev-head"><h1>{name}{inRange && <> · {ageGroupLabel(months, lang)}</>}</h1><p>{copy.tagline[lang]}</p></header>
    {inRange ? <ActivityCarousel activities={activitiesForAge(months, state.inventory)} lang={lang} /> : <p className="dev-empty">{copy.over[lang]}</p>}
    <section className="dev-garden"><img src={gardenHasGrowth(moments.length) ? garden.url : gardenSeeds} alt="" /><div>{lang === 'en' ? `${moments.length} moment${moments.length === 1 ? "" : "s"} with ${name}` : `${moments.length} momen bersama ${name}`}</div></section>
    <section className="dev-areas"><h2>{copy.noticed[lang]}</h2>
      {areaIds.map(id => { const inArea = momentsInArea(moments, id); const latest = inArea[0]; return (
        <div key={id} className="dev-area">
          <div className="dev-area-icon"><AreaIcon area={id} /></div>
          <div className="dev-area-body">
            <div className="dev-area-top"><span><b>{AREAS[id].label[lang]}</b><small>{AREAS[id].kiaTerm[lang]}</small></span><em>{inArea.length}</em></div>
            <span className="dev-area-latest">{latest ? `${getActivity(latest.activityId)?.title[lang] ?? ''}: ${NOTICE_OPTIONS[latest.noticed ?? -1]?.[lang] ?? ''}` : copy.none[lang]}</span>
          </div>
        </div>); })}
    </section>
  </div>;
}
