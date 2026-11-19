import { LanguageSwitch } from './language';
import { useLanguage } from '@/components/asah/language';
import { useState, type ReactNode } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Bookmark, Check, ChevronDown, Flower2, History, Home, Leaf, Plus, Settings, Sprout, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAsah } from './store';
import { ageLabel, ageMonths } from '@/lib/asah';
import { ChildForm, Modal } from './shared';
const nav = [{ to: '/', label: 'Hari ini', icon: Home }, { to: '/tersimpan', label: 'Tersimpan', icon: Bookmark }, { to: '/perkembangan', label: 'Perkembangan', icon: Sprout }, { to: '/riwayat', label: 'Riwayat', icon: History }, { to: '/pengaturan', label: 'Pengaturan', icon: Settings }] as const;
export function AsahShell({ children }: {
    children: ReactNode;
}) {
    const { t, locale } = useLanguage();
    const { state, child, update, online, now } = useAsah();
    const path = useLocation({ select: l => l.pathname });
    const [add, setAdd] = useState(false);
    const [picker, setPicker] = useState(false);
    return <div className="app-shell"><aside className="sidebar"><Link to="/" className="brand"><Flower2 />{t("asah")}<span>{t(".")}</span></Link><p className="brand-caption">{t("Momen kecil, tumbuh bersama.")}</p><nav className="desktop-nav">{nav.map(({ to, label, icon: Icon }) => <Button key={to} variant="ghost" className={`nav-item ${path === to ? 'active' : ''}`} asChild><Link to={to}><Icon />{t(label)}{path === to && <span className="nav-dot"/>}</Link></Button>)}</nav><div className="sidebar-bottom"><div className="sidebar-leaf"><Leaf /></div><p>{t("Tidak perlu sempurna.")}<br />{t("Cukup hadir bersama.")}</p><span className="prototype-label">{t("Prototipe Asah")}</span><Link to="/transparansi">{t("Tentang Asah & data ")}<span>{t("\u2197")}</span></Link></div></aside>
    <div className="main-shell"><header className="topbar"><Link to="/" className="mobile-brand brand"><Flower2 />{t("asah")}<span>{t(".")}</span></Link><span className="desktop-welcome">{t("Ruang kecil untuk tumbuh bersama")}</span><div className="topbar-right"><LanguageSwitch/>{!online && <span className="offline-label"><WifiOff size={15}/>{t("Offline")}</span>}<span className="plan-badge">{t(state.plan === 'pro' ? 'Pro · simulasi' : 'Gratis')}</span>{child && <div className="child-selector"><Button variant="ghost" className="child-trigger" aria-label={t("Ganti profil anak")} aria-haspopup="dialog" onClick={() => setPicker(true)}><span className="avatar">{child.name.charAt(0)}</span><span className="child-meta"><span className="child-name">{child.name.trim().split(/\s+/)[0]}</span><small>{t(ageLabel(ageMonths(child.dob, now)))}</small></span><ChevronDown size={14}/></Button></div>}</div></header><main className="page-content">{children}</main><footer className="page-footer"><Leaf size={14}/><span>{t("Bukan pengganti tenaga kesehatan")}</span><Link to="/transparansi">{t("Sumber & privasi")}</Link></footer></div>
    <nav className="mobile-nav">{nav.map(({ to, label, icon: Icon }) => <Button key={to} variant="ghost" className={path === to ? 'active' : ''} asChild><Link to={to} aria-current={path === to ? 'page' : undefined}><span className="nav-indicator"><Icon /></span><span>{t(label)}</span></Link></Button>)}</nav><Modal title={t("Pilih anak")} description={t("Setiap anak memiliki aktivitas dan catatannya sendiri.")} open={picker} close={() => setPicker(false)}><div className="child-picker">{state.children.map(c => <Button key={c.id} variant="ghost" className={`child-option ${c.id === state.selected ? 'active' : ''}`} onClick={() => { update(s => ({ ...s, selected: c.id })); setPicker(false); }}><span className="avatar">{c.name.charAt(0)}</span><span className="child-meta"><span className="child-name">{c.name}</span><small>{t(ageLabel(ageMonths(c.dob, now)))}</small></span>{c.id === state.selected && <Check size={17}/>}</Button>)}<Button variant="outline" onClick={() => { setPicker(false); setAdd(true); }}><Plus />{t("Tambah anak")}</Button></div></Modal><Modal title={t("Tambah si kecil")} description={t("Setiap anak memiliki aktivitas dan catatannya sendiri.")} open={add} close={() => setAdd(false)}><ChildForm onDone={() => setAdd(false)}/></Modal></div>;
}
