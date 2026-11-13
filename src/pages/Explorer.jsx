import { useMemo } from "react";
import { useApp } from "../store.jsx";
import { D, TP, CREW, st, sh, pc, fx } from "../analysis.js";

const dotCol = (z) => (z >= 4 ? "#c93a6e" : z >= 2 ? "#ffb347" : z >= 1 ? "#ffcf8a" : "#4de1ff");
const cellBg = (j, z) => (j < 3 ? "#101a40" : z >= 4 ? "#c93a6e" : z >= 2 ? "#d98b1f" : z >= 1 ? "#8a6a2c" : "#1a2550");

export default function Explorer() {
  const { c, t, a, oth, q, set } = useApp();
  const s = st(a, c), W = 640, H = 240, L = 44, R = 14, T = 14, B = 30;
  const crews = oth ? CREW : [c];
  const all = crews.flatMap((k) => D[a].v[k]).filter((x) => x != null);
  let lo = Math.min(s.mn, ...all), hi = Math.max(s.mx, ...all);
  const pad = (hi - lo) * 0.12 || 1; lo -= pad; hi += pad;
  const X = (i) => L + (i * (W - L - R)) / 6, Y = (v) => T + ((hi - v) * (H - T - B)) / (hi - lo), mid = (X(2) + X(3)) / 2;
  const pts = (arr) => arr.map((v, i) => (v == null ? null : X(i) + "," + Y(v))).filter(Boolean).join(" ");
  const rows = useMemo(() => {
    const ms = (i) => Math.max(...[3, 4, 5, 6].map((k) => sh(i, c, k)));
    return D.map((_, i) => i)
      .filter((i) => !q || D[i].a.toLowerCase().includes(q.toLowerCase()))
      .sort((x, y) => D[x].p.localeCompare(D[y].p) || ms(y) - ms(x));
  }, [c, q]);
  const cur = s.v[t];
  let pn = "";
  const trs = [];
  rows.forEach((i) => {
    if (D[i].p !== pn) { pn = D[i].p; trs.push(<tr key={"g" + pn} className="g"><td colSpan="8">{pn} panel</td></tr>); }
    trs.push(
      <tr key={i}>
        <td className="n">{D[i].a}</td>
        {TP.map((x, j) => {
          const v = D[i].v[c][j], z = sh(i, c, j);
          return (
            <td key={j} tabIndex="0" className={i === a && j === t ? "sel" : ""} onClick={() => set({ a: i, t: j })}
              onKeyDown={(e) => e.key === "Enter" && set({ a: i, t: j })}
              style={{ background: cellBg(j, z), outline: z >= 4 ? "2px solid #fff" : undefined, outlineOffset: z >= 4 ? -4 : undefined }}
              title={`${D[i].a} ${x}: ${fx(v)}`}>
              {v == null ? "n/a" : j < 3 ? "–" : z >= 1 ? z.toFixed(1) : "·"}
            </td>
          );
        })}
      </tr>
    );
  });
  return (
    <div className="grid">
      <section className="card c12">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <h2>{D[a].a} ({D[a].p}) – {c}</h2>
            <p className="sub" style={{ margin: 0 }}>
              {cur == null ? "No sample for this crew member at this time." : t < 3 ? "Pre-flight sample: part of the baseline." : `${TP[t]}: ${fx(cur)} vs baseline ${fx(s.mn)}–${fx(s.mx)}, ${fx(pc(a, c, t))}% from baseline mean.`}
            </p>
          </div>
          <label className="sub" style={{ margin: 0 }}><input type="checkbox" checked={oth} onChange={(e) => set({ oth: e.target.checked })} /> show other crew (faint)</label>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`${D[a].a} trend for ${c}`}>
          <rect x={L} y={Y(s.mx)} width={W - L - R} height={Math.max(2, Y(s.mn) - Y(s.mx))} fill="#4de1ff" opacity=".16" />
          <line x1={L} x2={W - R} y1={Y(s.me)} y2={Y(s.me)} stroke="#4de1ff" strokeDasharray="4 4" opacity=".6" />
          <text x={L + 4} y={Y(s.mx) - 4} fontSize="11" fill="#4de1ff">own pre-flight band</text>
          {[0, 1, 2, 3, 4].map((k) => { const v = lo + ((hi - lo) * k) / 4; return <text key={k} x={L - 6} y={Y(v) + 4} textAnchor="end" fontSize="10.5" fill="#98a5c9">{fx(v)}</text>; })}
          {TP.map((x, i) => <text key={x} x={X(i)} y={H - 8} textAnchor="middle" fontSize="11" fill={i === t ? "#fff" : "#98a5c9"} fontWeight={i === t ? 700 : 400}>{x}</text>)}
          <line x1={mid} x2={mid} y1={T} y2={H - B} stroke="#a595ff" strokeDasharray="3 5" />
          <text x={mid + 4} y={T + 10} fontSize="10.5" fill="#a595ff">flight</text>
          {oth && CREW.filter((k) => k !== c).map((k) => <polyline key={k} fill="none" stroke="#a595ff" opacity=".3" strokeWidth="1.5" points={pts(D[a].v[k])} />)}
          <polyline fill="none" stroke="#4de1ff" strokeWidth="2.5" points={pts(s.v)} />
          {s.v.map((v, i) => v == null ? null : (
            <circle key={i} cx={X(i)} cy={Y(v)} r={i === t ? 8 : 5} fill={dotCol(sh(a, c, i))} stroke="#fff" strokeWidth={i === t ? 2 : 0} tabIndex="0" style={{ cursor: "pointer" }} onClick={() => set({ t: i })}>
              <title>{TP[i]}: {fx(v)} {i < 3 ? "(baseline)" : `(${fx(pc(a, c, i))}% vs own baseline mean)`}</title>
            </circle>
          ))}
        </svg>
      </section>
      <section className="card c12">
        <h2>Heatmap of all {D.length} analytes</h2>
        <p className="sub">
          <input placeholder="Search analyte..." aria-label="Search analyte" value={q} onChange={(e) => set({ q: e.target.value })}
            style={{ background: "rgba(255,255,255,.07)", color: "inherit", border: "1px solid var(--b)", borderRadius: 9, padding: "6px 10px", marginRight: 10 }} />
          Rows are sorted by largest post-flight shift. Cells show how far a value is beyond the person's own pre-flight range (in range-widths). Click a cell to inspect it.
        </p>
        <div className="scroll" style={{ maxHeight: 520, overflowY: "auto" }}>
          <table><thead><tr><th></th>{TP.map((x) => <th key={x}>{x}</th>)}</tr></thead><tbody>{trs}</tbody></table>
        </div>
      </section>
    </div>
  );
}
