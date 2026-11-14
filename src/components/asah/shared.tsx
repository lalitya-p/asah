import { useLanguage } from '@/components/asah/language';
import { useState, type ReactNode } from 'react';
import { ArrowRight, Bookmark, Check, Clock3, Download, Flag, Share2, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAsah } from './store';
import { durationSteps, stages, type Activity } from '@/lib/catalog';
import { Onboarding } from '@/components/asah/Onboarding';
export { ChildForm } from '@/components/asah/ChildForm';
export function PageHeading({ eyebrow, title, children }: {
    eyebrow: string;
    title: string;
    children?: ReactNode;
}) { const { t, locale } = useLanguage(); return <header className="page-heading"><p className="eyebrow">{t(eyebrow)}</p><h1>{t(title)}</h1>{children && <p className="page-subtitle">{children}</p>}</header>; }
export function ReviewNote() { const { t, locale } = useLanguage(); return <p className="review-note"><ShieldCheck size={15}/>{t(" Contoh konten \u00B7 Belum ditinjau dokter anak")}</p>; }
export function Modal({ title, description, open, close, children }: {
    title: string;
    description: string;
    open: boolean;
    close: () => void;
    children: ReactNode;
}) { const { t, locale } = useLanguage(); return <Dialog open={open} onOpenChange={value => { if (!value)
    close(); }}><DialogContent className="asah-dialog"><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription>{children}</DialogContent></Dialog>; }
export function StartGate({ children }: {
    children: ReactNode;
}) {
    const { t } = useLanguage();
    const { ready, state } = useAsah();
    if (!ready)
        return <div className="py-24 text-center text-muted-foreground">{t("Menyiapkan ruang bermain\u2026")}</div>;
    if (state.children.length)
        return <>{children}</>;
    return <Onboarding />;
}
export function Upgrade({ open, close }: {
    open: boolean;
    close: () => void;
}) { const { t, locale } = useLanguage(); const { update } = useAsah(); return <Modal title={t("Lebih banyak pilihan dengan Pro")} description={t("Simulasi prototipe, bukan langganan atau pembayaran sungguhan.")} open={open} close={close}><div className="upgrade-feature"><Sparkles /><div><strong>{t("Ganti aktivitas tanpa batas")}</strong><p>{t("Temukan pilihan yang pas untuk hari ini.")}</p></div></div><Button size="lg" onClick={() => { update(s => ({ ...s, plan: 'pro' })); toast.success(t('Simulasi Pro aktif di perangkat ini.')); close(); }}>{t("Aktifkan simulasi Pro ")}<ArrowRight /></Button><Button variant="ghost" onClick={close}>{t("Tetap gunakan aktivitas saya")}</Button></Modal>; }
async function shareImage(activity: Activity, duration: number, t: (text: string) => string, downloadOnly = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 2000;
    const ctx = canvas.getContext('2d');
    if (!ctx)
        throw new Error('Gambar tidak tersedia');
    const css = getComputedStyle(document.documentElement);
    const color = (token: string) => css.getPropertyValue(token).trim();
    ctx.fillStyle = color('--card');
    ctx.fillRect(0, 0, 1000, 2000);
    ctx.fillStyle = color('--primary');
    ctx.font = 'bold 52px Arial';
    ctx.fillText('asah.', 60, 90);
    ctx.fillStyle = color('--foreground');
    let y = 155;
    const wrap = (text: string, size = 25, bold = false) => { text = t(text); ctx.font = `${bold ? 'bold ' : ''}${size}px Arial`; let line = ''; for (const word of text.split(' ')) {
        if (ctx.measureText(line + word).width > 870) {
            ctx.fillText(line, 60, y);
            y += size + 12;
            line = '';
        }
        line += word + ' ';
    } if (line) {
        ctx.fillText(line, 60, y);
        y += size + 15;
    } };
    wrap(activity.title, 38, true);
    wrap(`${duration} menit · ${stages.find(s => s.id === activity.stage)?.label ?? ''} · ${activity.focus}`);
    y += 15;
    for (const [label, text] of [['Tujuan', activity.aim], ['Bahan', activity.materials.join(', ')], ['Langkah', durationSteps(activity, duration).join(' ')], ['Percakapan kecil', activity.speech], ['Amati', activity.observe], ['Keamanan', activity.safety]] as [
        string,
        string
    ][]) {
        wrap(label, 25, true);
        wrap(text, 23);
        y += 12;
    }
    wrap('Contoh konten · Belum ditinjau dokter anak', 22);
    const trimmed = document.createElement('canvas');
    trimmed.width = 1000;
    trimmed.height = Math.min(y + 50, 2000);
    trimmed.getContext('2d')?.drawImage(canvas, 0, 0);
    const blob = await new Promise<Blob | null>(resolve => trimmed.toBlob(resolve, 'image/png'));
    if (!blob)
        throw new Error('Gagal membuat gambar');
    const file = new File([blob], 'aktivitas-asah.png', { type: 'image/png' });
    if (!downloadOnly && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: t(activity.title), text: t('Yuk, coba kegiatan sederhana ini bersama si kecil. Contoh konten Asah, belum ditinjau dokter anak.') });
        return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aktivitas-asah.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(t('Gambar diunduh. Bisa dilampirkan di WhatsApp.'));
}
export function ActivityDetail({ activity, duration, onComplete }: {
    activity: Activity;
    duration: 1 | 5 | 10;
    onComplete?: () => void;
}) {
    const { t, locale } = useLanguage();
    const { state, child, update } = useAsah();
    const [share, setShare] = useState(false);
    const [report, setReport] = useState(false);
    const saved = state.saved.some(s => s.activityId === activity.id && s.childId === child?.id);
    return <div className="activity-detail"><div className="flex flex-wrap gap-2"><span className="pill"><Clock3 size={14}/>{duration}{t(" menit")}</span><span className="pill pill-coral">{t(activity.focus)}</span><span className="pill">{t(stages.find(s => s.id === activity.stage)?.label)}</span></div><h2>{t(activity.title)}</h2><p className="text-muted-foreground">{t(activity.subtitle)}</p><section><h3>{t("Tujuan bermain")}</h3><p>{t(activity.aim)}</p></section><section><h3>{t("Yang perlu disiapkan")}</h3><div className="flex flex-wrap gap-2">{activity.materials.map(m => <span className="material" key={m}><Check size={14}/>{t(m)}</span>)}</div></section><section><h3>{t("Yuk, mulai bersama")}</h3><ol className="steps">{durationSteps(activity, duration).map((step, i) => <li key={step}><span>{i + 1}</span><p>{t(step)}</p></li>)}</ol></section><div className="speech"><Sparkles size={18}/><div><h3>{t("Percakapan kecil")}</h3><p>{t(activity.speech)}</p></div></div><section><h3>{t("Perhatikan dengan santai")}</h3><p>{t(activity.observe)}</p></section><div className="safety"><ShieldCheck size={20}/><div><h3>{t("Aman dulu, baru bermain")}</h3><p>{t(activity.safety)}</p></div></div><ReviewNote /><p className="text-xs text-muted-foreground">{t("Kerangka: ")}{t(stages.find(s => s.id === activity.stage)?.theory)}{t(". Dasar teori bukan validasi klinis aktivitas.")}</p><div className="detail-actions">{onComplete && <Button size="lg" onClick={onComplete}><Check />{t("Sudah bermain")}</Button>}<Button variant="outline" onClick={() => { if (!child)
        return; update(s => ({ ...s, saved: saved ? s.saved.filter(v => !(v.childId === child.id && v.activityId === activity.id)) : [...s.saved, { childId: child.id, activityId: activity.id, stage: activity.stage, duration }] })); toast.success(t(saved ? 'Aktivitas dihapus dari tersimpan.' : 'Aktivitas tersimpan di perangkat.')); }}><Bookmark fill={saved ? 'currentColor' : 'none'}/>{t(saved ? 'Tersimpan' : 'Simpan')}</Button><Button variant="outline" onClick={() => setShare(true)}><Share2 />{t("Bagikan")}</Button><Button title={t("Laporkan konten")} aria-label={t("Laporkan konten")} variant="ghost" size="icon" onClick={() => setReport(true)}><Flag /></Button></div>
  <Modal open={share} close={() => setShare(false)} title={t("Ajak keluarga bermain")} description={t("Kartu tidak menyertakan nama atau tanggal lahir anak.")}><Button onClick={() => shareImage(activity, duration, t).catch(e => { if (e.name !== 'AbortError')
        toast.error(t('Berbagi belum tersedia. Coba unduh gambar.')); })}><Share2 />{t("Bagikan gambar")}</Button><Button variant="outline" onClick={() => shareImage(activity, duration, t, true).catch(() => toast.error(t('Gambar belum dapat dibuat.')))}><Download />{t("Unduh gambar")}</Button><Button variant="outline" asChild><a target="_blank" rel="noreferrer" href={`https://wa.me/?text=${encodeURIComponent(t(`Yuk bermain: ${activity.title} (${duration} menit). Bahan: ${activity.materials.join(', ')}. ${durationSteps(activity, duration).join(' ')} Keamanan: ${activity.safety} Contoh konten Asah, belum ditinjau dokter anak.`))}`}>{t("Kirim teks ke WhatsApp ")}<ArrowRight /></a></Button></Modal>
  <Modal open={report} close={() => setReport(false)} title={t("Laporkan contoh konten")} description={t("Laporan ini hanya dicatat sebagai simulasi; tidak dikirim ke tim atau tenaga kesehatan.")}><label className="field-label">{t("Alasan")}<select className="field"><option>{t("Keamanan aktivitas")}</option><option>{t("Kurang sesuai usia")}</option><option>{t("Petunjuk kurang jelas")}</option></select></label><Button onClick={() => { toast.success(t('Simulasi laporan selesai. Tidak ada laporan yang dikirim.')); setReport(false); }}>{t("Konfirmasi simulasi laporan")}</Button></Modal>
  </div>;
}
