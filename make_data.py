"""Builds src/data.js from ALL complete analytes in your OSD-575 files. Run: python make_data.py
Files needed in data/osd575/ :
  *CMP_upload_SUBMITTED.csv, *cardiovascular_EvePanel_SUBMITTED.csv, *immune_EvePanel_SUBMITTED.csv,
  LSDS-8_Multiplex_serum_immune_AlamarPanel_TRANSFORMED.csv"""
import glob, json, pandas as pd
TP = ["L-92","L-44","L-3","R+1","R+45","R+82","R+194"]
CREW = ["C001","C002","C003","C004"]
def find(pat):
    h = glob.glob(f"data/osd575/**/{pat}", recursive=True)
    if not h: raise SystemExit(f"Missing file {pat} in data/osd575/")
    return h[0]
out = []
# Long-format panels (Eve + metabolic): keep analytes measured for all 4 crew at all 7 times
for pat, panel, a, v, s, t in [("*CMP_upload_SUBMITTED.csv","Metabolic","ANALYTE","VALUE","SUBJECT_ID","timepoint"),
        ("*cardiovascular_EvePanel_SUBMITTED.csv","Cardiac","Analyte","Concentration","ID","Timepoint"),
        ("*immune_EvePanel_SUBMITTED.csv","Immune","Analyte","Concentration","ID","Timepoint")]:
    d = pd.read_csv(find(pat)).rename(columns={a:"a",v:"v",s:"c",t:"t"}).dropna(subset=["v"])
    kept = 0
    for name, g in d.groupby("a"):
        if len(g) != 28: continue
        out.append({"p":panel,"a":name,"v":{c:[round(float(g[(g.c==c)&(g.t==x)].v.iloc[0]),4) for x in TP] for c in CREW}}); kept += 1
    print(f"{panel}: kept {kept} of {d.a.nunique()} analytes (rest are missing samples)")
# Alamar panel (NPQ, log2 scale). One sample is missing -> stored as null, never imputed.
w = pd.read_csv(find("*AlamarPanel_TRANSFORMED.csv"))
w["c"] = w["Sample ID"].str.split("_").str[0]; w["t"] = w["Sample ID"].str.split("_").str[-1]
cols = [c for c in w.columns if c.endswith("_concentration_npq")]
for col in cols:
    vals = {}
    for c in CREW:
        row = []
        for x in TP:
            m = w[(w.c==c)&(w.t==x)][col]
            row.append(round(float(m.iloc[0]),4) if len(m) and pd.notna(m.iloc[0]) else None)
        vals[c] = row
    out.append({"p":"Alamar","a":col.replace("_concentration_npq","").replace("_"," ").upper(),"v":vals})
print(f"Alamar: {len(cols)} proteins; samples in file: {len(w)} of 28")
open("src/data.js","w",encoding="utf-8").write("export const D="+json.dumps(out,separators=(",",":"),ensure_ascii=False)+";")
print("Wrote src/data.js with", len(out), "analytes")
