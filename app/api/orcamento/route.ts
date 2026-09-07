import {quoteStore} from '@/lib/storage';
export const runtime='nodejs';
const MAX_BYTES=3*1024*1024;
const fail=(error:string,status=400)=>Response.json({error},{status});
export async function POST(request:Request){
 const origin=new URL(request.url).origin;
 if(request.headers.get('origin')!==origin)return fail('Origem inválida.',403);
 if(Number(request.headers.get('content-length'))>MAX_BYTES+32000)return fail('Os anexos devem somar no máximo 3 MB.',413);
 try {
  const form=await request.formData();
  const raw=form.get('data');
  if(typeof raw!=='string'||raw.length>12000)return fail('Dados inválidos.');
  let d:Record<string,string>;
  try{d=JSON.parse(raw)}catch{return fail('Dados inválidos.')}
  if(!d||typeof d!=='object'||Array.isArray(d))return fail('Dados inválidos.');
  const required=['environment','piece','choice','name','phone','city'];
  if(required.some(k=>typeof d[k]!=='string'||!d[k].trim()||d[k].length>150))return fail('Preencha os campos obrigatórios.');
  if(d.phone.replace(/\D/g,'').length<10)return fail('Informe um telefone válido com DDD.');
  for(const[k,v]of Object.entries(d)){
   if(typeof v!=='string'||v.length>2000)return fail('Revise os dados informados.');
   if(!['environment','piece','choice','material','measurements','name','phone','city','message'].includes(k))return fail('Campo inválido.');
  }
  const files=form.getAll('files');
  if(files.length>3)return fail('Envie até 3 arquivos.');
  if(files.some(f=>!(f instanceof File)||!f.size))return fail('Arquivo inválido.');
  if(files.reduce((sum,f)=>sum+(f as File).size,0)>MAX_BYTES)return fail('Os anexos devem somar no máximo 3 MB.',413);
  const validated:{file:File,bytes:ArrayBuffer,type:string}[]=[];
  for(const f of files as File[]){
   const bytes=await f.arrayBuffer();const b=new Uint8Array(bytes);
   const ascii=(start:number,end:number)=>String.fromCharCode(...b.slice(start,end));
   const type=ascii(0,5)==='%PDF-'?'application/pdf':b[0]===255&&b[1]===216&&b[2]===255?'image/jpeg':b[0]===137&&ascii(1,4)==='PNG'?'image/png':ascii(0,4)==='RIFF'&&ascii(8,12)==='WEBP'?'image/webp':'';
   if(!type)return fail('Use arquivos PDF, JPG, PNG ou WebP válidos.');
   validated.push({file:f,bytes,type});
  }
  const store=quoteStore();
  const attachments:{name:string,url:string}[]=[];
  for(const{file,bytes,type}of validated){
   const token=crypto.randomUUID()+crypto.randomUUID().replaceAll('-','');
   await store.set('files/'+token,bytes,{metadata:{contentType:type,filename:file.name.slice(0,150)}});
   attachments.push({name:file.name,url:origin+'/api/arquivo/'+token});
  }
  const id='ECO-'+crypto.randomUUID().slice(0,8).toUpperCase();
  await store.setJSON('requests/'+id,{id,...d,attachments,createdAt:new Date().toISOString()});
  const message=['Olá! Conheci a Econorte pelo site e gostaria de solicitar um orçamento.','Referência: '+id,'Nome: '+d.name,'WhatsApp: '+d.phone,'Cidade: '+d.city,'Ambiente: '+d.environment,'Produzir: '+d.piece,'Material: '+(d.material||d.choice),'Medidas: '+(d.measurements||'Preciso de orientação'),d.message?'Mensagem: '+d.message:'',...attachments.map(a=>'Anexo: '+a.name+'\n'+a.url)].filter(Boolean).join('\n');
  return Response.json({id,url:'https://wa.me/5527988778389?text='+encodeURIComponent(message)},{headers:{'Cache-Control':'no-store'}});
 }catch(error){console.error('Quote storage unavailable:',error instanceof Error?error.name:'Unknown');return fail('Não foi possível preparar sua solicitação. Tente novamente ou fale pelo WhatsApp.',503)}
}
