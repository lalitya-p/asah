import { createFileRoute } from '@tanstack/react-router';
import { ChildSetup } from '@/components/asah/ChildSetup';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/setup-child')({
  head: () =>
    pageHead(
      'Tambah profil anak',
      'Ruang keluarga Anda sudah siap; tinggal tambahkan anak untuk melanjutkan.',
      true,
    ),
  component: ChildSetup,
});
