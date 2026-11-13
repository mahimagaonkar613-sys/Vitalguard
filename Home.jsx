import { Link } from "react-router-dom";
import { useApp } from "../store.jsx";
import { D, TP, idx, sh, SI } from "../analysis.js";

export default function Home() {
  const { c, t } = useApp();
  const post = t >= 3, v = post ? idx(c, t) : 0, lv = v < 15 ? 0 : v < 35 ? 2 : 3, r = 62, C = 2 * Math.PI * r;
  const n = D.reduce((k, _, a) => k + (sh(a, c, t) >= 1 ? 1 : 0), 0);
  return (
    <>
      <section className="card hero">
        <h1>Vital<span className="s0">Guard</span>: personalised biomarker surveillance for crewed missions</h1>
        <p className="tag" style={{ maxWidth: 720 }}>See how each astronaut's blood biomarkers move against their own baseline, understand why, and decide what to do next.</p>
        <div className="row" style={{ marginTop: 12 }}>
          <Link to="/biomarkers"><button>Open biomarker explorer</button></Link>
          <Link to="/alerts"><button>See alerts</button></Link>
          <Link to="/crew"><button>Crew overview</button></Link>
        </div>
      </section>
      <div className="banner" style={{ marginTop: 14 }}><b>Real data:</b> NASA OSDR study <b>OSD-575</b> (SpaceX Inspiration4 crew serum). 4 crew, samples before launch (L-) and after return (R+). <b>No in-flight samples and no wearable vitals in this dataset.</b> Decision support, not a diagnosis.</div>
      <div className="grid">
        <section className="card c5" aria-live="polite">
          <h2>Biomarker shift index</h2>
          <p className="sub">Share of measured analytes clearly beyond this person's own pre-flight range.</p>
          {!post ? (
            <p><span className="big s0">Baseline</span><br /><span className="sub">{TP[t]} is a pre-flight sample. It defines {c}'s own normal range. Pick R+1 or later to see shifts.</span></p>
          ) : (
            <div className="ringbox">
              <svg width="150" height="150" viewBox="0 0 150 150" role="img" aria-label={`Shift index ${v} percent`}>
                <circle cx="75" cy="75" r={r} fill="none" stroke="#ffffff1c" strokeWidth="12" />
                <circle cx="75" cy="75" r={r} fill="none" stroke="currentColor" className={"s" + lv} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${C * v / 100} ${C}`} transform="rotate(-90 75 75)" style={{ transition: "stroke-dasharray .6s" }} />
                <text x="75" y="80" textAnchor="middle" fontSize="30" fontWeight="700" fill="#e8eefc">{v}%</text>
              </svg>
              <div>
                <span className={"chip s" + lv}>{SI[lv] || "●"} {["Stable", "", "Attention recommended", "Review suggested"][lv]}</span>
                <p className="sub" style={{ marginTop: 8 }}>{c} at {TP[t]}: {n} of {D.length} analytes are clearly beyond their own pre-flight range.</p>
              </div>
            </div>
          )}
          <details><summary>How is this calculated?</summary><p className="sub">Baseline = min and max of the pre-flight samples. A value is a clear shift if it lies at least one baseline range-width outside that band. Index = clear shifts divided by analytes with a value. Alamar values are log2 (NPQ), so % change is the fold change.</p></details>
        </section>
        <section className="card c7">
          <h2>What the platform does</h2>
          <ul>
            <li><b>Problem:</b> crews far from Earth need early, explainable health signals that work with delayed communication.</li>
            <li><b>Approach:</b> compare every crew member only with their own pre-flight baseline, flag shifts that persist, and show the evidence behind each flag.</li>
            <li><b>Real data:</b> NASA OSD-575 (Inspiration4): {D.length} analytes, 4 crew, 7 sample times.</li>
            <li><b>Potential relevance:</b> long-duration crewed missions, and extreme-environment physiology such as high altitude and aviation. A prototype; no agency has reviewed or endorsed it.</li>
          </ul>
        </section>
      </div>
    </>
  );
}
