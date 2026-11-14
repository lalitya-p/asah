import { createContext, useContext, useEffect, useState, type Context, type ReactNode } from 'react';
import { translate, type Language } from '@/lib/language';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
type LanguageState = { language: Language; setLanguage: (language: Language) => void; t: (text: string | undefined) => string; locale: string };
const LanguageContext: Context<LanguageState | null> = import.meta.hot?.data?.languageContext ?? createContext<LanguageState | null>(null);
if(import.meta.hot?.data) import.meta.hot.data.languageContext = LanguageContext;
export function LanguageProvider({children}:{children:ReactNode}) {
 const [language,setLanguage]=useState<Language>('id'); const [ready,setReady]=useState(false);
 useEffect(()=>{try{if(localStorage.getItem('asah-language')==='en')setLanguage('en');}catch{}setReady(true);},[]);
 useEffect(()=>{if(!ready)return;document.documentElement.lang=language;try{localStorage.setItem('asah-language',language);}catch{}},[language,ready]);
 return <LanguageContext.Provider value={{language,setLanguage,t:text=>translate(text,language),locale:language==='en'?'en-US':'id-ID'}}>{children}</LanguageContext.Provider>;
}
export function useLanguage():LanguageState {return useContext(LanguageContext) ?? {language:'id',setLanguage:()=>{},t:text=>text ?? '',locale:'id-ID'};}
export function LanguageSwitch(){const {language,setLanguage}=useLanguage();return <div className="language-switch" role="group" aria-label="Language / Bahasa"><Languages aria-hidden size={15}/><Button size="sm" variant="ghost" aria-label="Bahasa Indonesia" aria-pressed={language==='id'} className={language==='id'?'selected':''} onClick={()=>setLanguage('id')}>ID</Button><Button size="sm" variant="ghost" aria-label="English" aria-pressed={language==='en'} className={language==='en'?'selected':''} onClick={()=>setLanguage('en')}>EN</Button></div>;}