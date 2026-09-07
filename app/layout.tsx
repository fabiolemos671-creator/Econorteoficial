import {siteUrl} from '@/lib/site-url';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import SiteShell from './site-shell';
import './globals.css';
import './floating-header.css';
import './group-effects.css';
const geist=Geist({variable:'--font-geist-sans',subsets:['latin'],display:'swap'});
export const metadata:Metadata={icons:{icon:"/favicon.png"},metadataBase:new URL(siteUrl()),title:{default:'Econorte — Mármores e Granitos',template:'%s | Econorte'},description:'Pedras naturais e superfícies selecionadas para bancadas, cozinhas, banheiros e projetos de arquitetura. Conheça a Econorte e solicite seu orçamento.',openGraph:{title:'Econorte — Mármores e Granitos',description:'Excelência esculpida em cada detalhe.',locale:'pt_BR',type:'website'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body className={geist.variable}><SiteShell>{children}</SiteShell><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'LocalBusiness',name:'Econorte — Mármores e Granitos',url:siteUrl(),telephone:'+5527988778389',sameAs:['https://www.instagram.com/econorte_marmoresegranitos/']})}}/></body></html>}


