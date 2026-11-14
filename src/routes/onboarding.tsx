import { createFileRoute } from '@tanstack/react-router';
import { Onboarding } from '@/components/asah/Onboarding';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/onboarding')({
  head: () =>
    pageHead(
      'Perkenalan',
      'Enam langkah singkat: kenapa bermain berarti, peran Anda, profil anak, tahap usianya, dan barang di rumah.',
      true,
    ),
  component: Onboarding,
});
