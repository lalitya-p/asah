// Asah: play activities for the Development (Perkembangan) page.
// Age groups follow Buku KIA: every 3 months to 1 year, every 6 months to 2 years, then yearly.
// All copy is Asah's own wording, not Buku KIA checklist items.
// SAMPLE CONTENT: needs pediatric review before launch.


import cilukba1 from "@/assets/asah/cilukba-1.svg.asset.json";
import cilukba2 from "@/assets/asah/cilukba-2.svg.asset.json";
import cilukba3 from "@/assets/asah/cilukba-3.svg.asset.json";
import reach1 from "@/assets/asah/reach-1.svg.asset.json";
import reach2 from "@/assets/asah/reach-2.svg.asset.json";
import reach3 from "@/assets/asah/reach-3.svg.asset.json";
import shaker1 from "@/assets/asah/shaker-1.svg.asset.json";
import shaker2 from "@/assets/asah/shaker-2.svg.asset.json";
import shaker3 from "@/assets/asah/shaker-3.svg.asset.json";
import sounds1 from "@/assets/asah/sounds-1.svg.asset.json";
import sounds2 from "@/assets/asah/sounds-2.svg.asset.json";
import sounds3 from "@/assets/asah/sounds-3.svg.asset.json";

export type Lang = "id" | "en";
export type Text = Record<Lang, string>;
export type AreaId = "moving" | "hands" | "talking" | "others";

// Everyday name first; the Buku KIA term is shown small underneath.
export const AREAS: Record<AreaId, { label: Text; kiaTerm: Text }> = {
  moving: { label: { id: "Bergerak", en: "Moving" }, kiaTerm: { id: "gerak kasar", en: "gross motor skills" }, },
  hands: { label: { id: "Pakai tangan", en: "Using hands" }, kiaTerm: { id: "gerak halus", en: "fine motor skills" }, },
  talking: { label: { id: "Bicara", en: "Talking" }, kiaTerm: { id: "bicara & bahasa", en: "speech & language" }, },
  others: { label: { id: "Bersama orang lain", en: "With others" }, kiaTerm: { id: "sosialisasi", en: "socialisation" }, },
};

// Buku KIA age groups, in months. Only the child's current group is shown in the UI.
export const AGE_GROUPS = [
  [0, 3], [3, 6], [6, 9], [9, 12], [12, 18], [18, 24], [24, 36], [36, 48], [48, 60], [60, 72],
] as const;

export function ageGroupFor(months: number) {
  return AGE_GROUPS.find(([from, to]) => months >= from && months < to) ?? AGE_GROUPS[9];
}

export interface Activity {
  id: string;
  ageGroup: readonly [number, number];
  minutes: number;
  title: Text;
  description: Text;
  areas: AreaId[];
  theme: { bg: string; accent: string };
  steps: { title: Text; text: Text; image?: string; alt: Text }[];
  why: Text;
  safety?: Text;
}

export const ACTIVITIES: Activity[] = [
  {
    id: "ciluk-ba",
    ageGroup: [6, 9],
    minutes: 5,
    title: { id: "Ciluk ba", en: "Ciluk ba" },
    description: { id: "Permainan petak umpet dengan wajahmu.", en: "A hide-and-seek game with your face." },
    areas: ["others", "talking"],
    theme: { bg: "#FBF3E2", accent: "#8A5A1F" },
    steps: [
      {
        title: { id: "Tutup wajahmu", en: "Hide your face" },
        text: { id: "Duduk berhadapan. Tutup wajah dengan tangan atau kain lembut.", en: "Sit face to face. Cover your face with your hands or a soft cloth." },
        image: cilukba1.url,
        alt: { id: "Tangan menutup wajah", en: "Hands covering the face" },
      },
      {
        title: { id: "Jeda dan intip", en: "Pause and peek" },
        text: { id: "Ucapkan \"ciluk...\" pelan-pelan. Tunggu sebentar supaya si kecil penasaran.", en: "Say \"ciluk...\" slowly. Wait a moment so your little one wonders where you went." },
        image: cilukba2.url,
        alt: { id: "Mengintip dengan satu mata", en: "Peeking out with one eye" },
      },
      {
        title: { id: "Muncul: \"Ba!\"", en: "Pop out: \"Ba!\"" },
        text: { id: "Buka tangan sambil tersenyum lebar. Ulangi beberapa kali selama si kecil senang.", en: "Open your hands with a big smile. Repeat a few times while your little one enjoys it." },
        image: cilukba3.url,
        alt: { id: "Tangan terbuka dengan senyum lebar", en: "Hands open wide with a big smile" },
      },
    ],
    why: {
      id: "Si kecil belajar bahwa kamu tetap ada walau tersembunyi, dan belajar bergantian denganmu.",
      en: "Your little one learns you're still there, even when hidden, and how to take turns with you.",
    },
  },
  {
    id: "botol-bunyi",
    ageGroup: [6, 9],
    minutes: 5,
    title: { id: "Botol bunyi", en: "Rice shaker bottle" },
    description: { id: "Mainan kerincing buatan sendiri untuk digenggam dan digoyang.", en: "A homemade rattle to grip and shake." },
    areas: ["hands"],
    theme: { bg: "#E9F1F3", accent: "#2D5563" },
    steps: [
      {
        title: { id: "Tutup rapat", en: "Seal the lid tight" },
        text: { id: "Isi botol plastik kecil dengan sedikit beras. Tutup rapat dan lilit dengan selotip.", en: "Put a little rice in a small plastic bottle. Close it tightly and tape the lid." },
        image: shaker1.url,
        alt: { id: "Botol berisi beras dengan tutup diselotip", en: "Bottle with rice and a taped lid" },
      },
      {
        title: { id: "Goyangkan di dekatnya", en: "Shake near your baby" },
        text: { id: "Goyangkan pelan di samping si kecil. Lihat apakah ia menoleh ke arah suara.", en: "Shake it gently to one side. See if your little one turns toward the sound." },
        image: shaker2.url,
        alt: { id: "Tangan menggoyang botol", en: "A hand shaking the bottle" },
      },
      {
        title: { id: "Biarkan ia menggoyang", en: "Let your baby shake" },
        text: { id: "Berikan botolnya dan biarkan si kecil mencoba sendiri.", en: "Hand over the bottle and let your little one try." },
        image: shaker3.url,
        alt: { id: "Bayi menggoyang botol", en: "Baby shaking the bottle" },
      },
    ],
    why: {
      id: "Melatih genggaman, dan si kecil belajar bahwa gerakannya menghasilkan bunyi.",
      en: "Builds grip, and your little one learns that moving makes sound.",
    },
    safety: {
      id: "Pastikan tutup tidak bisa dibuka dan selalu dampingi. Beras yang tumpah bisa membuat tersedak.",
      en: "Make sure the lid can't open and stay close the whole time. Loose rice is a choking risk.",
    },
  },
  {
    id: "raih-bola",
    ageGroup: [6, 9],
    minutes: 5,
    title: { id: "Raih bolanya", en: "Reach for the ball" },
    description: { id: "Waktu tengkurap dengan sesuatu yang seru untuk diraih.", en: "Tummy time with something fun to reach for." },
    areas: ["moving"],
    theme: { bg: "#EAF1E7", accent: "#2F6B4F" },
    steps: [
      {
        title: { id: "Tengkurap di alas", en: "Tummy on a mat" },
        text: { id: "Letakkan si kecil tengkurap di alas yang lembut dan rata.", en: "Lay your little one on their tummy on a soft, flat mat." },
        image: reach1.url,
        alt: { id: "Bayi tengkurap di alas", en: "Baby on tummy on a mat" },
      },
      {
        title: { id: "Bola sedikit di luar jangkauan", en: "Ball just out of reach" },
        text: { id: "Taruh bola atau mainan favorit sedikit di depan tangannya.", en: "Place a ball or favourite toy just beyond their hands." },
        image: reach2.url,
        alt: { id: "Bola di depan bayi", en: "A ball in front of the baby" },
      },
      {
        title: { id: "Sorak setiap usaha", en: "Cheer every try" },
        text: { id: "Semangati setiap gerakan. Berhenti kalau si kecil terlihat lelah.", en: "Cheer every movement. Stop if your little one seems tired." },
        image: reach3.url,
        alt: { id: "Bayi meraih bola", en: "Baby reaching toward the ball" },
      },
    ],
    why: {
      id: "Membangun kekuatan untuk berguling, meraih, dan nanti merangkak.",
      en: "Builds strength to roll, reach and later crawl.",
    },
  },
  {
    id: "tiru-suara",
    ageGroup: [6, 9],
    minutes: 5,
    title: { id: "Tiru suaranya", en: "Copy your baby's sounds" },
    description: { id: "Ngobrol bolak-balik yang sederhana dengan si kecil.", en: "A simple back-and-forth chat with your baby." },
    areas: ["talking", "others"],
    theme: { bg: "#F3ECF5", accent: "#6B3F78" },
    steps: [
      {
        title: { id: "Saling berhadapan", en: "Face to face" },
        text: { id: "Dekatkan wajahmu dan tatap matanya.", en: "Bring your face close and make eye contact." },
        image: sounds1.url,
        alt: { id: "Orang tua dan bayi berhadapan", en: "Parent and baby face to face" },
      },
      {
        title: { id: "Tunggu suaranya", en: "Wait for a sound" },
        text: { id: "Diam sejenak dan tunggu si kecil bersuara.", en: "Pause and wait for your little one to make a sound." },
        image: sounds2.url,
        alt: { id: "Bayi bersuara ba-ba", en: "Baby says ba-ba" },
      },
      {
        title: { id: "Tirukan kembali", en: "Copy it back" },
        text: { id: "Ulangi suaranya dengan senyum, lalu tunggu balasannya.", en: "Repeat the sound with a smile, then wait for a reply." },
        image: sounds3.url,
        alt: { id: "Orang tua menirukan ba-ba", en: "Parent copies ba-ba" },
      },
    ],
    why: {
      id: "Si kecil belajar bahwa bicara itu bergantian.",
      en: "Your little one learns that talking is a back-and-forth.",
    },
  },
];

// Answer choices on the log screen. Every answer counts; none is "wrong".
export const NOTICE_OPTIONS: Text[] = [
  { id: "Tertawa atau tersenyum", en: "Laughed or smiled" },
  { id: "Mencari wajahku", en: "Looked for my face" },
  { id: "Memperhatikan dengan tenang", en: "Watched quietly" },
  { id: "Sedang tidak tertarik", en: "Not interested today" },
  { id: "Lainnya", en: "Something else" },
];

export const getActivity = (id?: string) => ACTIVITIES.find((a) => a.id === id);
