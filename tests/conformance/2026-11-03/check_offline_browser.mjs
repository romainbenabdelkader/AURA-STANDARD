import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import assert from 'node:assert/strict';
import { verifierRoot, resultFile } from './source-paths.mjs';

const {chromium}=await import(process.env.AURA_PLAYWRIGHT_MODULE || 'playwright');
const root=verifierRoot + path.sep;
const bundle=JSON.parse(fs.readFileSync(new URL('vectors.json',import.meta.url)));
const original=bundle.vectors.find(v=>v.id==='f02-original-quickstart');
const cases=[
  ['original',original,true,'verified'],
  ['changed-asset',{...original,assetHex:original.assetHex+'00'},true,'mismatch'],
  ['changed-declaration',{...original,manifestText:original.manifestText.replace('neutral-reference-fixture','altered-reference-fixture')},false,'verified'],
];
const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!file.startsWith(root)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');
  res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
const out={row:'N01',test:'Real Chromium engine after local module load, page network disabled',results:[],requestsDuringVerification:[]};
try {
  browser=await chromium.launch({headless:true,...(process.env.AURA_CHROME_EXECUTABLE?{executablePath:process.env.AURA_CHROME_EXECUTABLE}:{})});
  out.browserVersion=browser.version();
  const context=await browser.newContext({serviceWorkers:'block'});
  const page=await context.newPage();
  const origin=`http://127.0.0.1:${server.address().port}`;
  await page.goto(origin+'/web/index.html');
  await page.evaluate(async()=>{window.reviewVerifier=(await import('/src/verify-web.js')).verifyAuraPackageBrowser;});
  await context.setOffline(true);
  await context.route('**/*',route=>route.abort());
  page.on('request',req=>out.requestsDuringVerification.push(req.url()));
  for(const [name,v,sig,integrity] of cases){
    const report=await page.evaluate(async v=>window.reviewVerifier({manifestText:v.manifestText,publicKeyPem:v.publicKeyPem,
      issuerText:v.issuerText,assetBytes:Uint8Array.from(v.assetHex.match(/../g)||[],x=>parseInt(x,16))}),v);
    assert.equal(report.signatureOk,sig,name);
    assert.equal(report.integrityStatus,integrity,name);
    out.results.push({name,report});
  }
  assert.deepEqual(out.requestsDuringVerification,[]);
  out.passed=true;
} catch(error){out.passed=false;out.error=String(error.stack);process.exitCode=1;}
finally {
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
  fs.writeFileSync(resultFile('offline-browser-results.json'),JSON.stringify(out,null,2)+'\n');
  console.log(JSON.stringify({row:out.row,browser:out.browserVersion,cases:out.results.length,requests:out.requestsDuringVerification.length,passed:out.passed,error:out.error}));
}
