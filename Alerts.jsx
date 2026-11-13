import { useState } from "react";
import { useApp } from "../store.jsx";
import { Link } from "react-router-dom";
import { D, TP, st, sh, pc, dir, idx, sev, persist, alertsFor, fx, SN, SI } from "../analysis.js";

export default function Alerts() {
  const { c, t, dis, mon, esc, set, toast } = useApp();
  const [pend, setPend] = useState("");
  const [ans, setAns] = useState("Choose a question.");
  const L = alertsFor(c, t);
  const ask = (q) => {
    if (t < 3) return setAns(`${TP[t]} is a pre-flight sample, so there is nothing to compare yet. Select R+1 or later.`);
    if (q === "why") {
      if (t === 3) return setAns(`R+1 is the first post-flight sample. The index is ${idx(c, t)}% because ${L.length} of ${D.length} analytes are clearly beyond ${c}'s own range. Largest: ${L.slice(0, 3).map((a) => D[a].a + " (" + fx(pc(a, c, t)) + "%)").join(", ") || "none"}.`);
      const B = alertsFor(c, t - 1), nw = L.filter((a) => !B.includes(a)), gone = B.filter((a) => !L.includes(a));
      return setAns(`Index moved from ${idx(c, t - 1)}% (${TP[t - 1]}) to ${idx(c, t)}% (${TP[t]}).\nNewly beyond range: ${nw.slice(0, 8).map((a) => D[a].a).join(", ") || "none"}${nw.length > 8 ? ` and ${nw.length - 8} more` : ""}.\nBack within range: ${gone.length} analytes.\nData period: ${TP[t - 1]} to ${TP[t]}. Confidence: Low to Medium. Not a diagnosis.`);
    }
    if (q === "chg") {
      const p = t === 3 ? 2 : t - 1;
      const A = D.map((_, a) => a).filter((a) => D[a].v[c][t] != null && D[a].v[c][p] != null).map((a) => [a, pc(a, c, t) - pc(a, c, p)]).sort((x, y) => Math.abs(y[1]) - Math.abs(x[1])).slice(0, 5);
      return setAns(`Biggest movements vs ${TP[p]} for ${c}:\n` + A.map(([a, d]) => `- ${D[a].a}: ${d > 0 ? "+" : ""}${fx(d)} percentage points of baseline mean`).join("\n"));
    }
    setAns(`VitalGuard summary (demo, decision support)\nCrew: ${c} · Sample: ${TP[t]} · Source: NASA OSD-575\nIndex: ${idx(c, t)}% of analytes clearly beyond own pre-flight range.\n` + (L.slice(0, 6).map((a) => `- ${D[a].a}: ${fx(pc(a, c, t))}% from own baseline mean, ${sh(a, c, t).toFixed(1)} range-widths outside, persistence ${persist(a, c, t)}`).join("\n") || "- No clear shifts.") + "\nLimits: 3 baseline samples, no in-flight data, 4 crew. Not a diagnosis.");
  };
  return (
    <div className="grid">
      <section className="card c7">
        <h2>SignalWatch alerts</h2>
        <p className="sub">Decision support, not a diagnosis. Every alert shows its evidence.</p>
        {t < 3 ? <p className="sub">{TP[t]} is a baseline sample. Alerts start at R+1.</p>
          : !L.length ? <p className="sub s0">No analyte is clearly beyond {c}'s own range at {TP[t]}. Keep routine monitoring.</p>
          : L.slice(0, 8).map((a) => {
            const z = sh(a, c, t), v = sev(z), k = `${c}|${t}|${a}`, p = persist(a, c, t), s = st(a, c);
            const state = esc[k] ? "Escalated for medical review (demo)" : dis[k] ? "Dismissed" : mon[k] ? "Monitoring" : "";
            const nx = v === 3 ? "Share with the medical officer and repeat the draw." : v === 2 ? "Check hydration and recent activity; compare with the next sample." : "Keep monitoring at the next sample.";
            return (
              <div key={k} className={`al a${v}${dis[k] ? " done" : ""}`}>
                <h3><span className={"s" + (v === 1 ? 1 : v === 2 ? 2 : 3)}>{SI[v]} {SN[v]}</span> · {D[a].a} {dir(a, c, t)} own baseline</h3>
                <p><b>What changed:</b> {fx(s.v[t])} at {TP[t]} vs baseline {fx(s.mn)}–{fx(s.mx)} ({fx(pc(a, c, t))}% from baseline mean; {z.toFixed(1)} range-widths outside).</p>
                <p><b>Source:</b> OSD-575 {D[a].p} panel · <b>Persistence:</b> {p} sample{p > 1 ? "s" : ""} in a row · <b>Confidence:</b> {p > 1 ? "Medium" : "Low"} (few baseline samples)</p>
                <p><b>Possible contributors:</b> spaceflight recovery, hydration, activity or assay variation. Not determinable from this data.</p>
                <p><b>Next step:</b> {nx} <i>Decision support, not a diagnosis.</i></p>
                <div className="row">
                  {state ? <span className="chip s1">{state}</span> : (<>
                    <button onClick={() => { set({ mon: { ...mon, [k]: 1 } }); toast("Monitoring this signal"); }}>Monitor</button>
                    <button onClick={() => { set({ dis: { ...dis, [k]: 1 } }); toast("Alert dismissed"); }}>Dismiss</button>
                    <button onClick={() => { if (pend === k) { set({ esc: { ...esc, [k]: 1 } }); setPend(""); toast("Escalation note prepared for the medical officer (demo)"); } else { setPend(k); toast("Press again to confirm escalation"); } }}>{pend === k ? "Confirm escalate?" : "Escalate to medical officer"}</button>
                  </>)}
                  <Link to="/biomarkers"><button onClick={() => set({ a })}>Show trend</button></Link>
                </div>
              </div>
            );
          })}
        {L.length > 8 && <p className="sub">+{L.length - 8} more in the heatmap.</p>}
      </section>
      <section className="card c5">
        <h2>Ask VitalGuard</h2>
        <p className="sub">Rule-based explainer that reads only the numbers in this app (no external AI service).</p>
        <div className="row">
          <button onClick={() => ask("why")}>Why did the index change?</button>
          <button onClick={() => ask("chg")}>What changed since last sample?</button>
          <button onClick={() => ask("sum")}>Prepare medical officer summary</button>
        </div>
        <pre>{ans}</pre>
      </section>
    </div>
  );
}
