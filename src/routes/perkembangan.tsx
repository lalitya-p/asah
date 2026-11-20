import { createFileRoute } from '@tanstack/react-router';
import { useLanguage } from '@/components/asah/language';
import { useAsah } from '@/components/asah/store';
import { AreaIcon } from '@/components/asah/area-icon';
import { AREAS, NOTICE_OPTIONS, getActivity, type AreaId } from '@/data/asahActivities';
import { ageGroupLabel, areaIds, childMoments, momentsInArea } from '@/lib/moments';
import { GardenCanvas } from '@/components/asah/GardenCanvas';
import { ageMonths } from '@/lib/asah';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/perkembangan')({ head: () => pageHead('Perkembangan', 'Ide main sesuai kelompok usia Buku KIA dan momen yang kamu perhatikan, tanpa penilaian.'), component: Development });

const copy = {
  tagline: { id: 'Pahami, jangan bandingkan.', en: "Understand, don't compare." },
  noticed: { id: 'Yang kamu perhatikan', en: "What you've noticed" },
  none: { id: 'Belum ada momen', en: 'No moments yet' },
  gardenIntro: {
    id: 'Setiap aktivitas yang selesai menyiram satu tanaman. Semakin sering bermain, semakin tumbuh taman ini — gambaran keterampilan yang sedang dilatih.',
    en: 'Every finished activity waters a plant. The more you play, the more this garden grows — a picture of the skills being practiced.',
  },
};

function Development() {
  const { language: lang, t } = useLanguage();
  const { child, state, now } = useAsah();
  const months = ageMonths(child?.dob ?? '', now);
  const moments = childMoments(state.logs, child?.id);
  const name = child?.name ?? '';
  const inRange = months >= 0 && months < 72;
  return <div className="dev-page">
    <header className="dev-head"><h1>{name}{inRange && <> · {ageGroupLabel(months, lang)}</>}</h1><p>{copy.tagline[lang]}</p></header>
    <section className="dev-garden"><p className="dev-garden-intro">{copy.gardenIntro[lang]}</p><GardenCanvas counts={Object.fromEntries(areaIds.map(a => [a, momentsInArea(moments, a).length])) as Record<AreaId, number>} labels={Object.fromEntries(areaIds.map(a => [a, AREAS[a].label[lang]])) as Record<AreaId, string>} onSelect={a => document.getElementById(`area-${a}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })} /><div>{lang === 'en' ? `${moments.length} moment${moments.length === 1 ? "" : "s"} with ${name}` : `${moments.length} momen bersama ${name}`}</div></section>
    <section className="dev-areas"><h2>{copy.noticed[lang]}</h2>
      {areaIds.map(id => {
        const inArea = momentsInArea(moments, id);
        const latest = inArea[0];
        const latestTitle = latest ? getActivity(latest.activityId)?.title[lang] ?? t(latest.title) : '';
        const latestNotice = latest
          ? latest.noticed !== undefined
            ? NOTICE_OPTIONS[latest.noticed]?.[lang] ?? ''
            : latest.response ? t(latest.response) : ''
          : '';
        return (
        <div key={id} id={`area-${id}`} className="dev-area">
          <div className="dev-area-icon"><AreaIcon area={id} /></div>
          <div className="dev-area-body">
            <div className="dev-area-top"><span><b>{AREAS[id].label[lang]}</b><small>{AREAS[id].kiaTerm[lang]}</small></span><em>{inArea.length}</em></div>
            <span className="dev-area-latest">{latest ? `${latestTitle}${latestNotice ? `: ${latestNotice}` : ''}` : copy.none[lang]}</span>
          </div>
        </div>); })}
    </section>
  </div>;
}
