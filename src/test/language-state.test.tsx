import { act, render, cleanup } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { LanguageProvider, useLanguage } from '@/components/asah/language';
import { AsahProvider, useAsah } from '@/components/asah/store';
afterEach(()=>{cleanup();localStorage.clear();});
it('switches between English and Indonesian without changing child records or quotas',()=>{
 let controls: ReturnType<typeof useLanguage> | undefined;
 let store: ReturnType<typeof useAsah> | undefined;
 function Probe(){controls=useLanguage();store=useAsah();return null;}
 render(<LanguageProvider><AsahProvider><Probe/></AsahProvider></LanguageProvider>);
 act(()=>store?.createSpace('Uji'));
 act(()=>store?.update(s=>({...s,children:[{id:'child',name:'Bima',dob:'2023-04-12'}],selected:'child',days:{child:{day:'2026-11-14',used:4,choice:4,duration:5}}})));
 expect(store?.state.children[0]?.name).toBe('Bima');
 const before=JSON.stringify(store?.state);
 act(()=>controls?.setLanguage('en'));
 expect(controls?.language).toBe('en');
 expect(localStorage.getItem('asah-language')).toBe('en');
 expect(document.documentElement.lang).toBe('en');
 expect(JSON.stringify(store?.state)).toBe(before);
 act(()=>controls?.setLanguage('id'));
 expect(controls?.language).toBe('id');
 expect(localStorage.getItem('asah-language')).toBe('id');
 expect(JSON.stringify(store?.state)).toBe(before);
});
it('restores a saved English language preference after mounting',()=>{
 localStorage.setItem('asah-language','en');
 let selected:string|undefined;
 function Probe(){selected=useLanguage().language;return null;}
 render(<LanguageProvider><Probe/></LanguageProvider>);
 expect(selected).toBe('en');
 expect(document.documentElement.lang).toBe('en');
});