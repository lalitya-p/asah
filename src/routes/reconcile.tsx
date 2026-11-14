import { createFileRoute } from '@tanstack/react-router';
import { Reconcile } from '@/components/asah/Reconcile';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/reconcile')({
  head: () =>
    pageHead('Periksa data Anda', 'Lihat data lama yang tersimpan di perangkat ini sebelum memakainya.', true),
  component: Reconcile,
});
