import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawn} from 'node:child_process';
import {BlobsServer} from '@netlify/blobs/server';
import {setEnvironmentContext} from '@netlify/blobs';

// Local integration test only: no Netlify account and no WhatsApp message sent.
const directory=await mkdtemp(join(tmpdir(),'econorte-blobs-'));
const blobs=new BlobsServer({directory,token:'local-test-only',logger:()=>{}});
const address=await blobs.start();
const endpoint=`http://localhost:${address.port}`;
setEnvironmentContext({siteID:'local-econorte-test',token:'local-test-only',edgeURL:endpoint,uncachedEdgeURL:endpoint,apiURL:endpoint});
const base='http://localhost:3100';
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3100'],{env:{...process.env},stdio:['ignore','pipe','pipe']});
let logs='';server.stdout.on('data',x=>{logs+=x});server.stderr.on('data',x=>{logs+=x});
try{
 let ready=false;
 for(let i=0;i<60;i++){try{if((await fetch(base)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,500))}
 assert.ok(ready,logs);
 const xml=await (await fetch(base+'/sitemap.xml')).text();
 const routes=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
 assert.equal(routes.length,28);
 for(const route of routes){const r=await fetch(base+route);assert.equal(r.status,200,route);const html=await r.text();assert.ok(html.includes('Econorte'),route);assert.ok(html.includes('main-navigation'),route)}
 const html=await(await fetch(base)).text();
 for(const path of ['/a-econorte','/materiais','/projetos','/inspiracoes','/contato','/orcamento'])assert.ok(html.includes(`href="${path}"`),path);
 const data={environment:'Cozinha',piece:'Bancada',choice:'Preciso de orientação',material:'',measurements:'2 m',name:'Teste local',phone:'27999990000',city:'Teste',message:'Não enviar.'};
 const form=new FormData();form.append('data',JSON.stringify(data));form.append('files',new Blob(['%PDF-1.4\n% teste local\n%%EOF'],{type:'application/pdf'}),'teste.pdf');
 const r=await fetch(base+'/api/orcamento',{method:'POST',headers:{Origin:base},body:form});const result=await r.json();assert.equal(r.status,200,JSON.stringify(result));
 const message=new URL(result.url).searchParams.get('text');
 const fileUrl=message.match(/http:\/\/localhost:3100\/api\/arquivo\/[a-f0-9-]+/)[0];
 const download=await fetch(fileUrl);assert.equal(download.status,200);assert.equal(download.headers.get('content-type'),'application/pdf');assert.ok((await download.text()).startsWith('%PDF'));
 const invalid=new FormData();invalid.append('data',JSON.stringify(data));invalid.append('files',new Blob(['not a pdf']),'fake.pdf');assert.equal((await fetch(base+'/api/orcamento',{method:'POST',headers:{Origin:base},body:invalid})).status,400);
 assert.equal((await fetch(base+'/api/orcamento',{method:'POST',headers:{Origin:'https://invalid.example'},body:new FormData()})).status,403);
 assert.equal((await fetch(base+'/api/arquivo/invalid')).status,404);
 const large=new FormData();large.append('data',JSON.stringify(data));large.append('files',new Blob([new Uint8Array(3*1024*1024+1)]),'large.pdf');assert.equal((await fetch(base+'/api/orcamento',{method:'POST',headers:{Origin:base},body:large})).status,413);
 console.log('PASS: 28 pages, navigation destinations, shared header, quote storage, PDF download, invalid-file rejection, upload size limit, origin protection.');
}finally{server.kill();await blobs.stop()}
