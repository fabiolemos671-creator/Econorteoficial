import {quoteStore} from '@/lib/storage';
export const runtime='nodejs';
export async function GET(_request:Request,{params}:{params:Promise<{token:string}>}){
 const{token}=await params;
 if(!/^[a-f0-9-]{68}$/.test(token))return new Response('Arquivo não encontrado',{status:404});
 try{
  const file=await quoteStore().getWithMetadata('files/'+token,{type:'arrayBuffer'});
  if(!file||!file.data)return new Response('Arquivo não encontrado',{status:404});
  return new Response(file.data,{headers:{
   'Content-Type':String(file.metadata.contentType||'application/octet-stream'),
   'Content-Disposition':"attachment; filename*=UTF-8''"+encodeURIComponent(String(file.metadata.filename||'referencia')),
   'X-Content-Type-Options':'nosniff','Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow'
  }});
 }catch{return new Response('Arquivo temporariamente indisponível',{status:503})}
}
