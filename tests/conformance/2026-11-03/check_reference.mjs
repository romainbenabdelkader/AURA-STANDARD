import fs from 'node:fs';
import assert from 'node:assert/strict';
import { verifierModule, resultFile } from './source-paths.mjs';
const { verifyAuraPackage } = await import(verifierModule('src/verify-node.js'));
const { verifyAuraPackageBrowser } = await import(verifierModule('src/verify-web.js'));

const vectors=JSON.parse(fs.readFileSync(new URL('vectors.json',import.meta.url))).vectors;
const results=[]; const failures=[];
const field=(obj,path)=>path.split('.').reduce((a,k)=>a?.[k],obj);
for(const v of vectors){
  const pkg={manifestText:v.manifestText,publicKeyPem:v.publicKeyPem,issuerText:v.issuerText,
    assetBytes:v.assetHex===null?null:Buffer.from(v.assetHex,'hex')};
  const result={id:v.id,row:v.row,engines:{}};
  for(const [name,verify] of [['node',verifyAuraPackage],['webcrypto_in_node',verifyAuraPackageBrowser]]){
    let report;
    try {report=await verify(pkg);} catch(error){report={thrown:String(error.message)};}
    result.engines[name]=report;
    try {
      if(v.expectedReference.throws){assert.match(report.thrown??'',new RegExp(v.expectedReference.throws));}
      else {
        assert.ok(!report.thrown,report.thrown);
        // Unsupported version is a selection failure, reported separately by
        // this implementation; no supported schema was actually checked.
        if(v.expectedSchema==='unsupported'){
          assert.equal(report.schemaValidation.status,'not_checked');
          assert.ok(report.errors.some(e=>/Unsupported AURA manifest version/.test(e)));
        } else assert.equal(report.schemaValidation.status,v.expectedSchema);
        for(const [key,value] of Object.entries(v.expectedReference)) assert.deepEqual(field(report,key),value,`${v.id}/${name}/${key}`);
      }
    } catch(error){failures.push({id:v.id,engine:name,error:error.message});}
  }
  try {
    for(const path of ['signatureOk','integrityStatus','schemaValidation.status','keyRevoked','status','thrown'])
      assert.deepEqual(field(result.engines.node,path),field(result.engines.webcrypto_in_node,path),`${v.id}: parity/${path}`);
  } catch(error){failures.push({id:v.id,error:error.message});}
  results.push(result);
}
const output={runtime:process.version,source_commit:'e1fa13c4fb253c2e07a99538524b869028bb62b4',
  limitation:'Both reference engines share AURA validation code; WebCrypto here runs in Node, not a browser. This is not external independent implementation evidence.',
  vectors:results.length,planned_rows:new Set(results.map(r=>r.row)).size,failures,results};
fs.writeFileSync(resultFile('reference-results.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({vectors:output.vectors,planned_rows:output.planned_rows,failures}));
if(failures.length)process.exitCode=1;
