import type { HouseholdInventory } from '@/lib/asah';
import type { AreaId } from '@/data/asahActivities';
import { evaluateMaterials, type MaterialMetadata, type MaterialRequirement } from '@/lib/inventory';

export type Stage = { id: number; label: string; name: string; focus: string[]; theory: string; theorySummary: string; tonight: string; watch: string };
export const stages: Stage[] = [
  { id: 1, label: '0–3 bulan', name: 'Mengenal dunia', focus: ['Kesadaran sensorik', 'Ikatan emosional', 'Mengikuti cahaya & gerakan'], theory: 'Piaget — Sensorimotor (refleks)', theorySummary: 'Bayi belajar melalui indra, gerakan, dan kedekatan dengan Anda.', tonight: 'Dekatkan wajah Anda dan ajak bayi berbicara dengan suara lembut.', watch: 'Perhatikan bagaimana bayi merespons suara dan wajah, tanpa menilai atau membandingkan.' },
  { id: 2, label: '4–11 bulan', name: 'Mulai menjelajah', focus: ['Sebab & akibat', 'Objek tetap ada', 'Motorik kasar'], theory: 'Piaget — Sensorimotor (reaksi sirkular primer)', theorySummary: 'Anak mengulangi tindakan dan mulai mengenali sebab dan akibat.', tonight: 'Coba cilukba singkat atau tunjukkan sebuah benda besar yang familier.', watch: 'Catat hal yang menarik perhatian anak. Setiap kesempatan bermain bisa berbeda.' },
  { id: 3, label: '1–2 tahun', name: 'Langkah pertama', focus: ['Bahasa', 'Berjalan', 'Awal bermain simbolis'], theory: 'Vygotsky — Zona Perkembangan Proksimal (ZPD); Erikson — Otonomi vs. Rasa Malu', theorySummary: 'Anak bertumbuh saat ditemani, diberi contoh, dan dibiarkan mencoba sendiri.', tonight: 'Sebutkan nama benda sehari-hari sambil bermain bersama.', watch: 'Amati usaha anak, bukan hasilnya. Beri ruang untuk berhenti atau mencoba lagi.' },
  { id: 4, label: '2–4 tahun', name: 'Imajinasi bertumbuh', focus: ['Bermain imajinatif', 'Interaksi sosial', 'Motorik halus'], theory: 'Piaget — Preoperasional; Montessori — Masa sensitif', theorySummary: 'Bermain pura-pura dan latihan mandiri membantu anak mengeksplorasi ide serta keterampilan baru.', tonight: 'Bermain pura-pura memasak atau bergiliran menyusun wadah besar.', watch: 'Perhatikan pilihan dan cara anak bermain; ini bukan daftar kemampuan yang harus dipenuhi.' },
  { id: 5, label: '4–5 tahun', name: 'Siap menemukan', focus: ['Kesiapan literasi', 'Pemecahan masalah', 'Regulasi emosi'], theory: 'Erikson — Inisiatif vs. Rasa Bersalah; Vygotsky — Dukungan bertahap (scaffolding)', theorySummary: 'Pilihan, cerita, dan bantuan secukupnya memberi anak ruang untuk berinisiatif.', tonight: 'Buat cerita dari gambar atau bicarakan perasaan tokoh dalam cerita.', watch: 'Dengarkan gagasan anak dan beri bantuan secukupnya. Tidak ada skor perkembangan.' },
];
export type Activity = MaterialMetadata & { id: string; stage: number; title: string; subtitle: string; focus: string; areas: AreaId[]; aim: string; materials: string[]; steps: string[]; observe: string; safety: string; speech: string; smallItems: boolean; version: number };

function metadataFor(materials: string[]): MaterialMetadata {
  const requiredMaterials: MaterialRequirement[] = materials.flatMap(label => {
    let itemId = '';
    let quantity = 1;
    if (label === 'Dua wadah plastik besar') { itemId = 'container-large'; quantity = 2; }
    else if (label === '3–4 wadah plastik besar') { itemId = 'container-large'; quantity = 3; }
    else if (label === 'Wadah plastik berbagai ukuran') { itemId = 'container-large'; quantity = 2; }
    else if (label === 'Wadah plastik besar') itemId = 'container-large';
    else if (label === 'Mangkuk plastik besar') itemId = 'bowl-large';
    else if (label === 'Sendok kayu besar') itemId = 'wooden-spoon';
    else if (label.startsWith('Kain besar')) itemId = 'cloth-large';
    else if (label.startsWith('Boneka besar')) itemId = 'doll-large';
    else if (label === 'Buku bergambar') itemId = 'picture-book';
    return itemId ? [{ itemId, quantity, substituteItemIds: [] }] : [];
  });
  return { materialFree: requiredMaterials.length === 0, requiredMaterials, optionalMaterials: [] };
}
const ideas: Record<number, [string, string, string, string[]][]> = {
  1: [ ['Wajah yang familier','Saling menatap, saling mengenal','Ikatan emosional',['Wajah dan suara Anda']], ['Suara lembut untukmu','Percakapan kecil penuh kehangatan','Kesadaran sensorik',['Suara Anda']], ['Ikuti kain berwarna','Gerakan perlahan di dekat bayi','Mengikuti cahaya & gerakan',['Kain besar berwarna']], ['Cerita sebelum istirahat','Bercerita dengan suara tenang','Ikatan emosional',['Suara Anda']], ['Lagu kecil bersama','Nada lembut dan jeda','Kesadaran sensorik',['Suara Anda']], ['Senyum bergantian','Sambut respons kecil bayi','Ikatan emosional',['Wajah Anda']] ],
  2: [ ['Cilukba dengan wajah','Kejutan kecil, tawa bersama','Objek tetap ada',['Tangan Anda']], ['Ketuk wadah besar','Kenali bunyi dan jedanya','Sebab & akibat',['Wadah plastik besar']], ['Kain muncul kembali','Benda familier di depan mata','Objek tetap ada',['Kain besar','Wadah plastik besar']], ['Suara dari dekat','Dengarkan dan sebutkan','Sebab & akibat',['Suara Anda']], ['Gerakan di atas alas','Waktu bermain mengikuti anak','Motorik kasar',['Alas datar yang bersih']], ['Sapa boneka besar','Kenalan dengan teman bermain','Objek tetap ada',['Boneka besar tanpa bagian lepas']] ],
  3: [ ['Kenali benda di rumah','Satu benda, banyak cerita','Bahasa',['Wadah plastik besar','Kain besar']], ['Jalan bersama','Ikuti langkah yang nyaman','Berjalan',['Lantai datar yang bersih']], ['Telepon pura-pura','Halo, siapa di sana?','Awal bermain simbolis',['Tangan Anda']], ['Masuk dan keluar','Eksplorasi wadah sehari-hari','Bahasa',['Dua wadah plastik besar']], ['Lagu dan nama','Sebut namanya bersama','Bahasa',['Suara Anda']], ['Boneka ikut makan','Bermain peran sederhana','Awal bermain simbolis',['Boneka besar','Mangkuk plastik besar']] ],
  4: [ ['Menara kecil, ide besar','Susun, coba, dan temukan bersama','Motorik halus',['3–4 wadah plastik besar','Alas datar']], ['Dapur imajinasi','Hari ini, siapa kokinya?','Bermain imajinatif',['Mangkuk plastik besar','Sendok kayu besar']], ['Toko kecil di rumah','Bergantian jadi penjual dan pembeli','Interaksi sosial',['Wadah plastik besar','Kain besar']], ['Selimut jadi cerita','Petualangan dari barang sehari-hari','Bermain imajinatif',['Kain besar','Boneka besar']], ['Giliranku, giliranmu','Bangun sesuatu bersama','Interaksi sosial',['Wadah plastik besar']], ['Lipatan kain','Coba lipat dengan caramu','Motorik halus',['Kain besar yang bersih']], ['Jadi hewan kesukaan','Tebak gerakan dan suaranya bersama','Bermain imajinatif',['Tubuh dan suara Anda']] ],
  5: [ ['Cerita dari gambar','Satu gambar, banyak kemungkinan','Kesiapan literasi',['Buku bergambar']], ['Jembatan wadah','Temukan susunan yang berbeda','Pemecahan masalah',['Wadah plastik besar']], ['Perasaan tokoh','Dengarkan cerita dan perasaan','Regulasi emosi',['Buku bergambar']], ['Akhir cerita versimu','Apa yang terjadi selanjutnya?','Kesiapan literasi',['Buku bergambar']], ['Urutkan yang besar','Coba, bandingkan, susun ulang','Pemecahan masalah',['Wadah plastik berbagai ukuran']], ['Jeda dan bernapas','Momen tenang bersama','Regulasi emosi',['Tempat duduk yang nyaman']] ],
};
// Development areas are content metadata, never inferred from a child's answer.
// Keeping them with the daily catalog lets Today, History and Development share
// the same completion records and language-independent area IDs.
const activityAreas: Record<string, AreaId[]> = {
  's1-0': ['others', 'talking'], 's1-1': ['talking', 'others'], 's1-2': ['moving'],
  's1-3': ['talking', 'others'], 's1-4': ['talking', 'others'], 's1-5': ['others', 'talking'],
  's2-0': ['others', 'talking'], 's2-1': ['hands', 'moving'], 's2-2': ['hands', 'others'],
  's2-3': ['talking', 'others'], 's2-4': ['moving'], 's2-5': ['talking', 'others'],
  's3-0': ['talking', 'hands'], 's3-1': ['moving'], 's3-2': ['talking', 'others'],
  's3-3': ['hands', 'talking'], 's3-4': ['talking', 'others'], 's3-5': ['others', 'talking'],
  's4-0': ['hands'], 's4-1': ['others', 'hands', 'talking'], 's4-2': ['others', 'talking', 'hands'],
  's4-3': ['others', 'talking', 'hands'], 's4-4': ['others', 'hands'], 's4-5': ['hands', 'others'],
  's4-6': ['hands'], 's4-7': ['moving', 'others', 'talking'],
  's5-0': ['talking', 'others'], 's5-1': ['hands'], 's5-2': ['talking', 'others'],
  's5-3': ['talking', 'others'], 's5-4': ['hands'], 's5-5': ['others'],
};
export const activities: Activity[] = stages.flatMap(stage => (ideas[stage.id] ?? []).map(([title, subtitle, focus, materials], index) => ({
  id: `s${stage.id}-${index}`, stage: stage.id, title, subtitle, focus, areas: activityAreas[`s${stage.id}-${index}`] ?? [], materials, ...metadataFor(materials),
  aim: `Memberi kesempatan anak mengeksplorasi ${focus.toLocaleLowerCase('id-ID')} melalui bermain bersama, tanpa target hasil.`,
  steps: stage.id === 1 ? ['Pastikan bayi nyaman, terjaga, dan berada di posisi aman bersama Anda.', 'Tunjukkan wajah atau kain besar dari jarak nyaman. Bicara atau bernyanyi perlahan.', 'Beri jeda untuk respons bayi. Akhiri saat bayi tampak lelah atau tidak nyaman.'] : stage.id === 2 ? ['Duduk bersama anak di alas datar dan aman. Siapkan bahan di dekat Anda.', 'Tunjukkan benda atau gerakan perlahan sambil menyebut namanya. Jangan menutup wajah anak.', 'Ikuti perhatian anak, beri jeda, dan hentikan saat anak tidak nyaman.'] : ['Siapkan bahan di alas datar. Duduk dekat anak dan beri contoh singkat.', `Ajak anak mencoba ${title.toLocaleLowerCase('id-ID')}. Biarkan anak memilih cara bermainnya.`, 'Bergiliran, sebutkan apa yang sedang dilakukan, dan sambut setiap usaha anak.'],
  observe: 'Apa yang menarik perhatian anak? Perhatikan usaha, pilihan, dan responsnya—tidak perlu menguji.',
  safety: 'Selalu dampingi anak. Gunakan benda besar, bersih, utuh, tanpa bagian lepas atau tepi tajam. Jauhkan benda kecil dan sumber panas. Cegah benda masuk mulut; hentikan bila anak tidak nyaman.',
  speech: stage.id <= 4 ? '“Ini apa, ya?” Sebut nama benda dengan lembut, lalu beri jeda. Untuk bayi: “Aku di sini, kita bermain bersama.”' : '“Menurutmu, apa yang bisa kita coba selanjutnya?” Dengarkan jawaban tanpa mengoreksi.',
  smallItems: false, version: 1,
})));
export function activityEligibility(activity: Activity, inventory: HouseholdInventory) { return evaluateMaterials(activity, inventory); }
export function activityFor(stage: number, choice: number, inventory?: HouseholdInventory): Activity | undefined { const list = activities.filter(a => a.stage === stage); const eligible = inventory ? list.filter(a => activityEligibility(a, inventory).eligible) : list; return eligible[choice % eligible.length]; }
export function durationSteps(activity: Activity, minutes: number): string[] { return minutes === 1 ? [activity.steps[0] ?? 'Siapkan bahan dengan aman.', 'Coba satu giliran singkat, lalu akhiri dengan hangat.'] : minutes === 10 ? [...activity.steps, 'Ulangi dengan variasi pilihan anak. Ambil jeda kapan pun diperlukan.'] : activity.steps; }