import { createFileRoute } from '@tanstack/react-router';
import { Welcome } from '@/components/asah/Welcome';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/welcome')({
  head: () =>
    pageHead(
      'Selamat datang',
      'Buat ruang keluarga Asah atau buka ruang yang sudah tersimpan di perangkat ini.',
      true,
    ),
  component: Welcome,
});
