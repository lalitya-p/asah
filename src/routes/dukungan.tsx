import { useLanguage } from '@/components/asah/language';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Heart, ArrowRight, Printer, Share2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAsah } from '@/components/asah/store';
import { Modal, PageHeading } from '@/components/asah/shared';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/dukungan')({ head: () => pageHead('Contoh alur dukungan', 'Demonstrasi non-klinis tentang menyiapkan pertanyaan dan catatan untuk tenaga kesehatan.'), component: Support });
function Support() {
    const { t, locale } = useLanguage();
    const { child } = useAsah();
    const [scenario, setScenario] = useState('');
    const [note, setNote] = useState(false);
    const [include, setInclude] = useState(false);
    const text = t(`CONTOH CATATAN ASAH — BUKAN PENILAIAN KLINIS\n${include && child ? `Nama: ${child.name}\nTanggal lahir: ${child.dob}\n` : ''}Contoh topik: ${scenario}\nPertanyaan: Apa yang sebaiknya saya amati saat bermain bersama?\nCatatan ini merupakan simulasi, bukan hasil penilaian perkembangan. Informasi rujukan, biaya, dan BPJS perlu dikonfirmasi kepada tenaga kesehatan.`);
    return <><PageHeading eyebrow={t("CONTOH SKENARIO · NON-KLINIS")} title={t("Bertanya adalah bentuk kepedulian.")}>{t("Alur contoh ini tidak menilai anak dan tidak dipicu oleh pengamatan Anda.")}</PageHeading><section className="support-section"><Heart /><h2>{t("Pilih situasi contoh")}</h2><p>{t("Gunakan skenario fiktif untuk melihat langkah selanjutnya.")}</p><select className="field" aria-label={t("Pilih skenario contoh")} value={scenario} onChange={e => setScenario(e.target.value)}><option value="">{t("Pilih contoh situasi")}</option><option value="Pengasuh ingin mendiskusikan pengalaman bermain">{t("Pengasuh ingin mendiskusikan pengalaman bermain")}</option><option value="Pengasuh ingin bertanya tentang panduan kelompok usia">{t("Pengasuh ingin bertanya tentang panduan kelompok usia")}</option></select>{scenario && <div className="support-next"><span className="pill pill-coral">{t("Contoh, bukan peringatan perkembangan")}</span><h3>{t("Anda tidak harus mencari jawaban sendiri.")}</h3><p>{t("Langkah berikut dalam contoh ini: siapkan pertanyaan untuk bidan, kader, atau dokter yang biasa mendampingi keluarga.")}</p><Button onClick={() => setNote(true)}>{t("Siapkan catatan contoh ")}<ArrowRight /></Button></div>}</section><section className="guidance-band"><ShieldCheck /><div><h3>{t("Rujukan, biaya & BPJS")}</h3><p>{t("Informasi klinis, alur rujukan, persyaratan BPJS dan biaya belum diverifikasi. Prototipe tidak memberikan perkiraan biaya atau menjanjikan cakupan. Konfirmasikan informasi kepada fasilitas kesehatan atau kanal resmi BPJS Kesehatan.")}</p></div></section><Modal open={note} close={() => setNote(false)} title={t("Pratinjau catatan contoh")} description={t("Bukan surat rujukan, diagnosis, atau hasil penilaian perkembangan.")}><label className="flex gap-3 text-sm print-hide"><input type="checkbox" checked={include} onChange={e => setInclude(e.target.checked)} disabled={!child}/>{t("Sertakan nama & tanggal lahir anak")}</label><div className="print-note"><h3>{t("CONTOH CATATAN ASAH")}</h3><pre>{t(text)}</pre></div><div className="flex gap-3 flex-wrap print-hide"><Button onClick={() => window.print()}><Printer />{t("Cetak catatan")}</Button><Button variant="outline" onClick={async () => { try {
        if (navigator.share)
            await navigator.share({ title: 'Contoh catatan Asah', text });
        else {
            await navigator.clipboard.writeText(text);
            toast.success(t('Catatan contoh disalin.'));
        }
    }
    catch (e) {
        if (e instanceof Error && e.name !== 'AbortError')
            toast.error(t('Belum dapat dibagikan. Coba cetak catatan.'));
    } }}><Share2 />{t("Bagikan catatan")}</Button></div></Modal></>;
}
