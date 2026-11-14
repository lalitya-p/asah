import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, Check, Heart, ShieldCheck, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/asah/language';
import { useAsah } from '@/components/asah/store';
import { ActivityCarousel } from '@/components/asah/ActivityCarousel';
import { PageHeading } from '@/components/asah/shared';
import { ageMonths, currentDay, stageFor } from '@/lib/asah';
import { stages } from '@/lib/catalog';
import { activitiesForAge } from '@/lib/moments';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/')({
  head: () => pageHead('Hari ini', 'Pilihan aktivitas sederhana sesuai usia anak untuk bermain bersama hari ini.'),
  component: Index,
});

function Index() {
  return <Today />;
}

function Today() {
  const { t, locale, language } = useLanguage();
  const { state, child, now } = useAsah();
  if (!child) return null;

  const months = ageMonths(child.dob, now);
  const stage = stageFor(months);
  const day = currentDay(state.days[child.id], now);
  const framework = stages.find(s => s.id === stage);
  const logs = state.logs.filter(l => l.childId === child.id);
  const todayLogs = logs.filter(l => currentDay(undefined, new Date(l.at)).day === day.day);
  const inRange = months >= 0 && months < 72;

  return <>
    <PageHeading eyebrow={t('SEDIKIT WAKTU, BANYAK MAKNA')} title={t(`Hari ini, bersama ${child.name}.`)}>
      {t('Tidak perlu sempurna. Satu momen bermain sudah berarti.')}
    </PageHeading>
    <div className="today-layout">
      <div className="today-main">
        {inRange ? <>
          <div className="section-top home-activity-date">
            <span className="date-label">{t(new Intl.DateTimeFormat(locale, { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'long', year: 'numeric' }).format(now))}</span>
          </div>
          <ActivityCarousel activities={activitiesForAge(months, state.inventory)} lang={language} />
        </> : <div className="empty-state">
          <Sprout />
          <h2>{t('Setiap usia punya perjalanan.')}</h2>
          <p>{t('Aktivitas Asah tersedia untuk anak di bawah 6 tahun. Profil dan catatan lama tetap dapat dibuka.')}</p>
          <Button variant="outline" asChild><Link to="/pengaturan">{t('Periksa profil')}</Link></Button>
        </div>}
        <div className="gentle-note">
          <Heart />
          <div><strong>{t('Bermain bukan soal hasil.')}</strong><p>{t('Ikuti rasa ingin tahu si kecil. Berhenti dan coba lagi kapan pun kalian ingin.')}</p></div>
        </div>
      </div>
      <aside className="today-aside">
        <section className="growth-preview">
          <span className="eyebrow">{t('MENGENAL TAHAPNYA')}</span>
          <div className="growth-icon"><Sprout /></div>
          <h2>{t(framework?.name ?? 'Perjalanan si kecil')}</h2>
          <p>{t(framework ? `Di kelompok ${framework.label}, bermain membuka ruang untuk ${(framework.focus[0] ?? 'bermain bersama').toLocaleLowerCase('id-ID')}.` : 'Catatan tetap menjadi milik keluarga Anda.')}</p>
          {framework && <div className="focus-tags">{framework.focus.map(f => <span key={f}>{t(f)}</span>)}</div>}
          <Button variant="link" asChild><Link to="/perkembangan">{language === 'en' ? `See ${child.name}’s developmental journey` : `Lihat perjalanan perkembangan ${child.name}`}<ArrowRight /></Link></Button>
          <p className="tiny-note">{t('Kerangka usia, bukan penilaian perkembangan.')}</p>
        </section>
        <section className="moments-preview">
          <div className="section-top"><h3>{t('Momen yang tercatat')}</h3><Heart size={17} /></div>
          {logs.length ? <>
            <strong className="moment-count">{todayLogs.length}</strong>
            <p>{t('momen bermain hari ini')}</p>
            <div className="recent-moment"><Check size={16} /><span>{t(logs[0]?.title ?? '')}</span></div>
          </> : <>
            <div className="empty-moment"><Heart /></div>
            <p>{t('Setiap usaha kecil layak dikenang.')}</p>
            <span className="tiny-note">{t('Catatan pertama akan muncul setelah bermain.')}</span>
          </>}
          <Button variant="link" asChild><Link to="/riwayat">{t('Lihat riwayat ')}<ArrowRight /></Link></Button>
        </section>
        <div className="trust-line"><ShieldCheck size={18} /><p>{t('Tanpa skor. Tanpa perbandingan.')}<br />{t('Hanya ruang untuk bertumbuh.')}</p></div>
      </aside>
    </div>
  </>;
}
