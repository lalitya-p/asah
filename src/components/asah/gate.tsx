import { Link, Navigate, useLocation } from '@tanstack/react-router';
import { Flower2, Leaf } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLanguage } from '@/components/asah/language';
import { LanguageSwitch } from '@/components/asah/language';
import { useAsah } from '@/components/asah/store';
import { AsahShell } from '@/components/asah/shell';

// Every screen a signed-out or unfinished person may open. Anything else is
// protected and the gate decides where it goes instead.
export const PUBLIC_PATHS = ['/welcome', '/reconcile', '/onboarding', '/setup-child'];

export function BootScreen() {
  const { t } = useLanguage();
  return (
    <div className="bare-shell">
      <main className="bare-content">
        <div className="boot-screen">
          <div className="boot-mark">
            <Flower2 />
          </div>
          <p>{t('Menyiapkan ruang bermain…')}</p>
        </div>
      </main>
    </div>
  );
}

// Chrome for the public screens: brand and language, no child selector, no
// bottom navigation, because there is nothing to navigate between yet.
export function AsahBare({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  return (
    <div className="bare-shell">
      <header className="bare-top">
        <Link to="/welcome" className="brand">
          <Flower2 />
          {t('asah')}
          <span>{t('.')}</span>
        </Link>
        <LanguageSwitch />
      </header>
      <main className="bare-content">{children}</main>
      <footer className="bare-foot">
        <Leaf size={14} />
        {t(' Dibuat untuk momen sehari-hari. Bukan pengganti tenaga kesehatan.')}
      </footer>
    </div>
  );
}

// One rule decides every destination: session, then confirmation, then
// onboarding, then a child profile. Pages never check access themselves.
export function AsahGate({ children }: { children: ReactNode }) {
  const { destination, account } = useAsah();
  const path = useLocation({ select: location => location.pathname });
  const onPublic = PUBLIC_PATHS.includes(path);
  if (destination === 'boot') return <BootScreen />;
  if (destination === 'welcome')
    return path === '/welcome' ? <AsahBare>{children}</AsahBare> : <Navigate to="/welcome" replace />;
  if (destination === 'reconcile')
    return path === '/reconcile' ? <AsahBare>{children}</AsahBare> : <Navigate to="/reconcile" replace />;
  if (destination === 'onboarding')
    return path === '/onboarding' ? <AsahBare>{children}</AsahBare> : <Navigate to="/onboarding" replace />;
  if (destination === 'setup-child')
    return path === '/setup-child' ? <AsahBare>{children}</AsahBare> : <Navigate to="/setup-child" replace />;
  if (onPublic && !account) return <Navigate to="/welcome" replace />;
  if (onPublic) return <Navigate to="/" replace />;
  return <AsahShell>{children}</AsahShell>;
}
