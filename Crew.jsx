import { useState } from "react";
import { useApp } from "../store.jsx";
import { D, TP, CREW, idx, pc, alertsFor, fx } from "../analysis.js";

export default function Crew() {
  const { c, t, set } = useApp();
  const [out, setOut] = useState("Choose a summary.");
  const line = (k) => `${k}: index ${idx(k, t)}%. Largest: ` + (alertsFor(k, t).slice(0, 3).map((a) => `${D[a].a} (${fx(pc(a, k, t))}%)`).join(", ") || "none");
  const all = () => setOut(t < 3 ? "Select R+1 or later to summarise shifts." : `VitalGuard crew summary (decision support, not a diagnosis)\nSource: NASA OSD-575 · Sample: ${TP[t]}\n` + CREW.map(line).join("\n") + "\nLimits: 3 baseline samples, no in-flight data, 4 crew.");
  const one = () => setOut(t < 3 ? "Select R+1 or later to summarise shifts." : `Crew member ${c} · ${TP[t]}\n` + line(c) + "\nNot a diagnosis.");
  return (
    <div className="grid">
      <section className="card c12">
        <h2>Crew overview (medical officer view)</h2>
        <p className="sub">Shift index per crew member and sample time: share of analytes clearly beyond their own pre-flight range. Click a crew button or a percentage to select.</p>
        <div className="scroll">
          <table>
            <thead><tr><th>Crew</th>{TP.slice(3).map((x) => <th key={x}>{x}</th>)}<th style={{ textAlign: "left" }}>Largest shifts at {TP[t]}</th></tr></thead>
            <tbody>
              {CREW.map((k) => (
                <tr key={k}>
                  <td className="n"><button className={k === c ? "on" : ""} onClick={() => set({ c: k })}>{k}</button></td>
                  {[3, 4, 5, 6].map((i) => { const v = idx(k, i); return (
                    <td key={i} onClick={() => set({ c: k, t: i })} title={`${k} ${TP[i]}`}
                      style={{ background: `hsl(${215 - v * 2.2},55%,${17 + v / 3}%)`, outline: i === t ? "2px solid #4de1ff" : undefined, outlineOffset: -2 }}>{v}%</td>); })}
                  <td className="n" style={{ textAlign: "left" }}>{t < 3 ? "baseline sample" : alertsFor(k, t).slice(0, 3).map((a) => D[a].a).join(", ") || "none"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="card c12">
        <h2>Summaries</h2>
        <div className="row"><button onClick={all}>Summary for all crew</button><button onClick={one}>Summary for selected crew member</button></div>
        <pre>{out}</pre>
      </section>
    </div>
  );
}
