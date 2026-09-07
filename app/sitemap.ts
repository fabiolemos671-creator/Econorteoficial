import {siteUrl} from '@/lib/site-url';
import {materials,projects,articles} from '@/lib/content';
export default function sitemap(){const origin=siteUrl();return ['','/a-econorte','/materiais','/projetos','/inspiracoes','/contato','/orcamento',...materials.map(m=>'/materiais/'+m.slug),...projects.map(p=>'/projetos/'+p.slug),...articles.map(a=>'/inspiracoes/'+a.slug)].map(path=>({url:origin+path,changeFrequency:'monthly' as const,priority:path===''?1:.7}))}

