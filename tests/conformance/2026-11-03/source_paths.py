"""Resolve and pin the source files used by this dated test campaign."""
import hashlib
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent
STANDARD = ROOT.parents[2]
LOCK = json.loads((ROOT/'source-lock.json').read_text())
for name, digest in LOCK['standard_files'].items():
    if hashlib.sha256((STANDARD/name).read_bytes()).hexdigest() != digest:
        raise RuntimeError('Pinned standard input differs: '+name)

def result_path(name):
    folder = Path(os.environ.get('AURA_RESULTS_DIR', str(ROOT/'run-results')))
    folder.mkdir(parents=True, exist_ok=True)
    return folder/name
