"""Separate schema/crypto checks on the stored fixture subset; not a full AURA engine."""
import base64
import hashlib
import importlib.metadata
import json
import platform
import re
from pathlib import Path
from source_paths import STANDARD, result_path
import jsonschema
from cryptography.hazmat.primitives import serialization
from cryptography.exceptions import InvalidSignature
from prepare_vectors import canonical_subset, unsigned

ROOT=Path(__file__).resolve().parent
def unique(pairs):
    obj={}
    for key,value in pairs:
        if key in obj: raise ValueError('Duplicate JSON member: '+key)
        obj[key]=value
    return obj

bundle=json.loads((ROOT/'vectors.json').read_text())
schemas={v:json.loads((STANDARD/f'schema/aura-manifest-v{v}.0.json').read_text()) for v in ['1.0','1.1']}
overlay=json.loads((STANDARD/'schema/profiles/aura-tdm-rights-reservation-v1.0.json').read_text())
results=[]; failures=[]
for vector in bundle['vectors']:
    row={'id':vector['id'],'row':vector['row']}
    inputs={'manifest':vector['manifestText'].encode(),'publicKey':vector['publicKeyPem'].encode()}
    if vector['assetHex'] is not None: inputs['asset']=bytes.fromhex(vector['assetHex'])
    if vector['issuerText'] is not None: inputs['issuer']=vector['issuerText'].encode()
    for name,data in inputs.items():
        if hashlib.sha256(data).hexdigest()!=vector['sha256'][name]: failures.append(vector['id']+': checksum/'+name)
    try:
        manifest=json.loads(vector['manifestText'],object_pairs_hook=unique)
    except ValueError as exc:
        row.update(schema='parse_rejected',parse_error=str(exc))
    else:
        schema=schemas.get(manifest.get('aura_version'))
        errors=list(jsonschema.Draft202012Validator(schema).iter_errors(manifest)) if schema else []
        row['schema']='unsupported' if schema is None else 'fail' if errors else 'pass'
        row['schema_errors']=[{'path':list(e.absolute_path),'keyword':e.validator,'message':e.message} for e in errors]
        if schema:
            fmt=list(jsonschema.Draft202012Validator(schema,format_checker=jsonschema.FormatChecker()).iter_errors(manifest))
            row['schema_with_format_assertions']='fail' if fmt else 'pass'
        if vector['expectedProfile']:
            row['profile']='fail' if list(jsonschema.Draft202012Validator(overlay).iter_errors(manifest)) else 'pass'
            if row['profile']!=vector['expectedProfile']: failures.append(vector['id']+': profile')
        try:
            payload=canonical_subset(unsigned(manifest))
            row['canonical_unsigned_sha256']=hashlib.sha256(payload).hexdigest()
            signature=base64.b64decode(manifest.get('signature',{}).get('value',''),validate=True)
            public=serialization.load_pem_public_key(vector['publicKeyPem'].encode())
            public.verify(signature,payload)
            row['signature']=True
        except (InvalidSignature,ValueError,TypeError) as exc:
            row['signature']=False
            row['signature_error']=type(exc).__name__
        if 'signatureOk' in vector['expectedReference'] and row['signature']!=vector['expectedReference']['signatureOk']:
            failures.append(vector['id']+': signature')
        if vector['assetHex'] is not None:
            row['computed_asset_sha3_256']=hashlib.sha3_256(bytes.fromhex(vector['assetHex'])).hexdigest()
            row['canonical_asset_field_match']=row['computed_asset_sha3_256']==manifest.get('asset',{}).get('hash')
            expected_integrity=vector['expectedReference'].get('integrityStatus')
            if expected_integrity in ['verified','mismatch'] and row['canonical_asset_field_match']!=(expected_integrity=='verified'):
                failures.append(vector['id']+': canonical asset binding')
        if vector['row']=='S04':
            original=next(v for v in bundle['vectors'] if v['row']=='F02')
            om=json.loads(original['manifestText'])
            row['same_signature_bytes']=manifest['signature']['value']==om['signature']['value']
            row['same_canonical_unsigned_bytes']=canonical_subset(unsigned(manifest))==canonical_subset(unsigned(om))
            row['different_file_bytes']=vector['manifestText']!=original['manifestText']
            if not all(row[k] for k in ['same_signature_bytes','same_canonical_unsigned_bytes','different_file_bytes']):
                failures.append(vector['id']+': serialization invariance isolation')
        row['strict_ulid_range']=bool(re.fullmatch(r'aura:v1:[0-7][0-9A-HJKMNP-TV-Z]{25}',manifest.get('aura_uid','')))
        if vector['row']=='F17': row['prior_hash_value']=manifest['prior_evidence'][0]['manifest_hash']
    if row['schema']!=vector['expectedSchema']: failures.append(vector['id']+': schema')
    results.append(row)

out={'python':platform.python_version(),'jsonschema':importlib.metadata.version('jsonschema'),
     'cryptography':importlib.metadata.version('cryptography'),'canonicalization_scope':bundle['canonicalizationScope'],
     'schema_format_policy':'default annotation-only; strict-format diagnostic recorded separately',
     'results':results,'vectors':len(results),'planned_rows':len({r['row'] for r in results}),'failures':failures}
result_path('python-results.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps({k:v for k,v in out.items() if k not in ['results','canonicalization_scope']}))
if failures: raise SystemExit(1)
