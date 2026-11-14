import { createFileRoute } from '@tanstack/react-router';
import { Onboarding } from '@/components/asah/Onboarding';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/onboarding')({
  head: () =>
    pageHead(
      'Perkenalan',
      'Empat langkah singkat: peran Anda, profil anak, perjalanan usia yang dipersonalisasi, dan barang di rumah.',
      true,
    ),
  component: Onboarding,
});
