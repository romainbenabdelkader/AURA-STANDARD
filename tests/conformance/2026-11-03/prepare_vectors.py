"""Build isolated test vectors; never write a private key or alter source evidence."""
import base64
import copy
import hashlib
import json
from pathlib import Path
from source_paths import STANDARD, result_path
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

ROOT = Path(__file__).resolve().parent
QUICK = STANDARD / 'examples/quickstart-v1.1'

def canonical_subset(value):
    """JCS-compatible only for ASCII strings, safe integers, bool/null, arrays/objects.

    This deliberately fails outside that subset; it is not a general JCS engine.
    """
    def guard(x):
        if x is None or isinstance(x, bool):
            return
        if isinstance(x, str):
            if not x.isascii():
                raise ValueError('Outside ASCII fixture subset')
        elif isinstance(x, int):
            if abs(x) > 9007199254740991:
                raise ValueError('Outside safe integer fixture subset')
        elif isinstance(x, list):
            for item in x: guard(item)
        elif isinstance(x, dict):
            for k, v in x.items():
                if not isinstance(k, str): raise ValueError('Non-string object key')
                guard(k); guard(v)
        else:
            raise ValueError('Outside fixture subset')
    guard(value)
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False).encode()

def unsigned(m):
    return {k: v for k, v in m.items() if k != 'signature'}

def generate():
    key = Ed25519PrivateKey.generate()
    public = key.public_key()
    der = public.public_bytes(serialization.Encoding.DER, serialization.PublicFormat.SubjectPublicKeyInfo)
    pem = public.public_bytes(serialization.Encoding.PEM, serialization.PublicFormat.SubjectPublicKeyInfo).decode()
    asset = b'AURA consolidation: isolated test fixture, not a production declaration.\n'
    registry = {'issuer': 'AURA-SCOPED-TEST', 'algorithm': 'Ed25519', 'status': 'active',
                'public_key_fingerprint_sha256': hashlib.sha256(der).hexdigest(),
                'public_key_fingerprint_sha3_256': hashlib.sha3_256(der).hexdigest(),
                'revoked_keys': []}
    anchor = copy.deepcopy(json.loads((QUICK/'manifest.json').read_text())['reference_anchor'])
    anchor['issuer_key'] = {'issuer_id': registry['issuer'], 'algorithm': 'Ed25519',
                           'public_key_digest': 'sha3-256:'+hashlib.sha3_256(der).hexdigest(),
                           'public_key_doi': 'urn:aura:test-only:not-publicly-archived'}

    def base(version='1.1', tdm=False):
        m = {'aura_version': version, 'aura_uid': 'aura:v1:01ARZ3NDEKTSV4RRFFQ69G5FAV',
             'issuer': {'id': registry['issuer']}, 'issued_at': '2026-11-03T08:00:00Z',
             'asset': {'hash_algorithm':'SHA3-256', 'hash':hashlib.sha3_256(asset).hexdigest()},
             'declarations': {'note':'Synthetic fixture; issuer time is declared, not attested.'}}
        if version == '1.1': m['reference_anchor'] = copy.deepcopy(anchor)
        if tdm:
            m['profile'] = 'AURA_TDM_RIGHTS_RESERVATION_V1'
            m['declarations']['tdm_opt_out'] = True
        return m

    def sign(m):
        m = copy.deepcopy(m)
        m['signature'] = {'algorithm':'Ed25519', 'canonicalization':'RFC-8785-JCS',
                          'value':base64.b64encode(key.sign(canonical_subset(unsigned(m)))).decode()}
        return m

    vectors = []
    def add(row, name, m, schema='pass', expected=None, post=None, raw=None,
            supplied_asset=asset, supplied_key=pem, supplied_registry=registry, profile=None, sign_it=True):
        m = sign(m) if sign_it else copy.deepcopy(m)
        if post: post(m)
        text = raw if raw is not None else json.dumps(m, ensure_ascii=False, indent=2)+'\n'
        v = {'row':row,'id':name,'manifestText':text,'publicKeyPem':supplied_key,
             'assetHex':supplied_asset.hex() if supplied_asset is not None else None,
             'issuerText':json.dumps(supplied_registry) if supplied_registry is not None else None,
             'expectedSchema':schema,'expectedReference':expected or {},'expectedProfile':profile}
        v['sha256'] = {k:hashlib.sha256(b).hexdigest() for k,b in [
            ('manifest',text.encode()),('publicKey',supplied_key.encode()),
            *([('asset',supplied_asset)] if supplied_asset is not None else []),
            *([('issuer',v['issuerText'].encode())] if v['issuerText'] is not None else [])]}
        vectors.append(v)

    good = {'signatureOk':True,'integrityStatus':'verified'}
    add('F01','f01-v10',base('1.0'),expected=good)
    qm=json.loads((QUICK/'manifest.json').read_text()); qa=(QUICK/'asset.txt').read_bytes()
    qp=(QUICK/'public-key.pem').read_text(); qi=json.loads((QUICK/'issuer.json').read_text())
    add('F02','f02-original-quickstart',qm,raw=(QUICK/'manifest.json').read_text(),supplied_asset=qa,supplied_key=qp,supplied_registry=qi,expected=good,sign_it=False)
    m=base(); m.pop('reference_anchor'); add('F03','f03-anchor-absent-v11',m,'fail')
    add('F04','f04-no-anchor-v10',base('1.0'),expected={'signatureOk':True})
    m=base(); m['aura_version']='1.2'; add('F05','f05-unsupported-version',m,'unsupported',{'signatureOk':True,'status':'invalid'})
    add('F06','f06-no-signature',base(),'fail',{'signatureOk':False},post=lambda m:m.pop('signature'))
    add('F07','f07-wrong-algorithm',base(),'fail',{'status':'invalid'},post=lambda m:m['signature'].update(algorithm='unsupported'))
    add('F08','f08-wrong-canonicalization',base(),'fail',{'status':'invalid'},post=lambda m:m['signature'].update(canonicalization='unsupported'))
    add('F09','f09-empty-signature',base(),'fail',{'signatureOk':False},post=lambda m:m['signature'].update(value=''))
    for version in ['1.0','1.1']:
        m=base(version); m['issuer']={}; add('F10','f10-empty-issuer-'+version,m)
        m=base(version); m.pop('asset'); add('F11','f11-no-evidence-marker-'+version,m,supplied_asset=None)
        m=base(version); m['asset_typo']={}; add('F12','f12-extension-'+version,m,expected={'signatureOk':True})
        m=base(version); m['aura_uid']='aura:v1:T8JTWMTHHTM3DKS5AAJ71BM406'; add('F13','f13-ulid-range-'+version,m)
        for suffix,uid in [('short','aura:v1:01'),('forbidden','aura:v1:I'+'0'*25)]:
            m=base(version); m['aura_uid']=uid; add('F14','f14-'+suffix+'-'+version,m,'fail')
    m=base(); m['reference_anchor']['verifier']['name']='TEST-OTHER-TOOL'; add('F15','f15-other-verifier-anchor',m,'fail')
    for field,digest in [('standard','schema_digest'),('verifier','source_digest'),('issuer_key','public_key_digest')]:
        m=base(); m['reference_anchor'][field][digest]=m['reference_anchor'][field][digest].split(':')[1]
        add('F16','f16-digest-prefix-'+field,m,'fail')
    for name,value,expected_schema in [('arbitrary','not-a-digest','pass'),('empty','','pass'),('number',17,'fail')]:
        m=base(); m['prior_evidence']=[{'aura_uid':m['aura_uid'],'manifest_hash':value}]
        add('F18' if name=='number' else 'F17','f17-f18-'+name,m,expected_schema)
    add('I01','i01-matching-asset',base(),expected=good)
    add('I02','i02-changed-asset',base(),expected={'signatureOk':True,'integrityStatus':'mismatch'},supplied_asset=asset+b'x')
    m=base(); m.pop('asset'); m['catalog_claim']={}; add('I03','i03-fileless',m,expected={'signatureOk':True,'integrityStatus':'not_applicable'},supplied_asset=None)
    add('I04','i04-missing-asset',base(),expected={'signatureOk':True,'integrityStatus':'not_checked'},supplied_asset=None)
    add('S01','s01-tampered-declaration',base(),expected={'signatureOk':False,'integrityStatus':'verified'},post=lambda m:m['declarations'].update(note='altered'))
    add('S02','s02-fresh-python-signature',base(),expected=good)
    other=Ed25519PrivateKey.generate().public_key().public_bytes(serialization.Encoding.PEM,serialization.PublicFormat.SubjectPublicKeyInfo).decode()
    add('S03','s03-wrong-public-key',base(),expected={'signatureOk':False},supplied_key=other)
    def reverse_keys(x):
        if isinstance(x,dict): return {k:reverse_keys(v) for k,v in reversed(list(x.items()))}
        if isinstance(x,list): return [reverse_keys(v) for v in x]
        return x
    add('S04','s04-original-signature-reordered',qm,raw=json.dumps(reverse_keys(qm),separators=(',',':')),supplied_asset=qa,supplied_key=qp,supplied_registry=qi,expected=good,sign_it=False)
    for version in ['1.0','1.1']:
        add('P01','p01-tdm-'+version,base(version,True),expected={'signatureOk':True,'tdmRightsReservation.profileVerified':True},profile='pass')
        for name,value in [('false',False),('null',None),('string','true'),('one',1),('zero',0),('array',[]),('object',{})]:
            m=base(version,True); m['declarations']['tdm_opt_out']=value
            add('P02','p02-'+name+'-'+version,m,expected={'status':'invalid'},profile='fail')
        for name in ['missing','empty']:
            m=base(version,True)
            if name=='missing': m['issuer'].pop('id')
            else: m['issuer']['id']=''
            add('P03','p03-'+name+'-'+version,m,expected={'status':'invalid'},profile='fail')
        for name in ['missing','wrong-algorithm']:
            m=base(version,True)
            if name=='missing': m['asset'].pop('hash')
            else: m['asset']['hash_algorithm']='SHA-256'
            add('P04','p04-'+name+'-'+version,m,expected={'status':'invalid'},profile='fail')
    add('P05','p05-no-profile',base(),expected={'tdmRightsReservation.profileClaimed':False,'tdmRightsReservation.profileVerified':None})
    m=base(tdm=True); m['declarations']['tdm_opt_out']=False
    add('P05','p05-invalid-profile',m,expected={'tdmRightsReservation.profileVerified':False},profile='fail')
    add('P06','p06-unassessed-authority',base(tdm=True),expected={**good,'tdmRightsReservation.issuerAuthorityAssessed':False,'tdmRightsReservation.discoverabilityAssessed':False,'tdmRightsReservation.legalEffectAssessed':False},profile='pass')
    rr=copy.deepcopy(registry); rr['revoked_keys']=[{'public_key_fingerprint_sha256':registry['public_key_fingerprint_sha256'],'revoked_at':'2099-01-01T00:00:00Z'}]
    add('R01','r01-listed-revoked-key',base(),expected={'signatureOk':True,'keyRevoked':True,'historicalValidity':'not_assessed','status':'invalid'},supplied_registry=rr)
    rr=copy.deepcopy(registry); rr.update(public_key_fingerprint_sha256='0'*64,public_key_fingerprint_sha3_256='0'*64)
    add('R02','r02-unmatched-registry-key',base(),expected={'signatureOk':True,'issuerKeyOk':False,'status':'invalid'},supplied_registry=rr)
    add('R03','r03-no-registry',base(),expected={'signatureOk':True,'keyStatusCheck':'not_checked','registryTrust.authenticity':'not_assessed','registryTrust.freshness':'not_assessed'},supplied_registry=None)
    add('T01','t01-declared-time-only',base(),expected={'issuedAtValidation.independentlyAttested':False})
    m=sign(base()); raw=json.dumps(m,separators=(',',':')).replace('"aura_version":','"aura_version":"1.1","aura_version":',1)
    add('V01','v01-duplicate-name',m,'parse_rejected',{'throws':'Duplicate JSON'},raw=raw,sign_it=False)
    m=base(); m['asset_hash']='0'*64; add('V02','v02-conflicting-hash-alias',m,expected={'signatureOk':True,'integrityStatus':'not_checked','status':'invalid'})
    m=base(); m['issued_at']='2026-02-30T00:00:00Z'; add('V03','v03-impossible-date',m,expected={'schemaValidation.status':'pass','issuedAtValidation.status':'invalid','signatureOk':True})
    add('N02','n02-pseudonymous-issuer',base(),expected=good)
    # Retain all four original quickstart file representations for F02;
    # S04 changes only manifest serialization, keeping the same issuer bytes.
    for v in vectors:
        if v['row'] in ['F02','S04']:
            v['issuerText']=(QUICK/'issuer.json').read_text()
            v['sha256']['issuer']=hashlib.sha256(v['issuerText'].encode()).hexdigest()
    result={'testOnly':True,'productionEmission':False,'canonicalizationScope':'ASCII strings and safe integer subset only; no general independent JCS implementation claimed',
            'standardCommit':'378a82ad3aa95978ea3beea0c727ea7772f01de3','verifierCommit':'e1fa13c4fb253c2e07a99538524b869028bb62b4',
            'privateKeyPersisted':False,'vectors':vectors}
    result_path('vectors.json').write_text(json.dumps(result,indent=2)+'\n')
    print(f'Generated {len(vectors)} isolated vectors across {len(set(v["row"] for v in vectors))} planned rows.')

if __name__=='__main__': generate()
