import json,hashlib,base64,sys,os,secrets
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives.serialization import Encoding,PublicFormat
out=sys.argv[1]; src=sys.argv[2]
m=json.load(open(src+'/manifest.json'))
asset=b"AURA S02 independent signing test asset\n"
open(out+'/asset.txt','wb').write(asset)
k=Ed25519PrivateKey.generate(); pk=k.public_key()   # private key never written to disk
der=pk.public_bytes(Encoding.DER,PublicFormat.SubjectPublicKeyInfo)
pem=pk.public_bytes(Encoding.PEM,PublicFormat.SubjectPublicKeyInfo)
open(out+'/public-key.pem','wb').write(pem)
f256=hashlib.sha256(der).hexdigest(); f3=hashlib.sha3_256(der).hexdigest()
A='0123456789ABCDEFGHJKMNPQRSTVWXYZ'
uid='aura:v1:'+secrets.choice('01234567')+''.join(secrets.choice(A) for _ in range(25))
kid='s02-independent-test-'+f256[:16]
m['aura_uid']=uid; m['issuer']={'id':'S02-INDEPENDENT-TEST','service':'independent-python','key_id':kid}
m['issued_at']='2026-11-03T08:50:00.000Z'
m['asset']={'filename':'asset.txt','hash_algorithm':'SHA3-256','hash':hashlib.sha3_256(asset).hexdigest()}
m['declarations']={'origin':'s02-independent-signing-test','legal_note':'Test-only. No person, authorship or rights.'}
m['reference_anchor']['issuer_key']={'issuer_id':'S02-INDEPENDENT-TEST','key_id':kid,'algorithm':'Ed25519','public_key_digest':'sha3-256:'+f3,'public_key_doi':'urn:aura:test-key:'+uid[8:]}
m.pop('prior_evidence',None); m.pop('signature',None)
pre=json.dumps(m,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
m['signature']={'algorithm':'Ed25519','canonicalization':'RFC-8785-JCS','format':'Ed25519 raw signature, base64 encoded','value':base64.b64encode(k.sign(pre)).decode()}
json.dump(m,open(out+'/manifest.json','w'),indent=2)
iss={'issuer':'S02-INDEPENDENT-TEST','algorithm':'Ed25519','public_key_url':'./public-key.pem','public_key_fingerprint_sha256':f256,'public_key_fingerprint_sha3_256':f3,'valid_from':'2026-11-03T08:50:00.000Z','status':'active','key_id':kid,'revoked_keys':[],'test_only':True,'production_use_prohibited':True}
json.dump(iss,open(out+'/issuer.json','w'),indent=2)
# tampered copy for S01
t=dict(m); t['declarations']=dict(m['declarations'],origin='tampered'); json.dump(t,open(out+'/manifest.tampered.json','w'),indent=2)
print('uid',uid)
