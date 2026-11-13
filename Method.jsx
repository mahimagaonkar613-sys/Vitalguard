import { D } from "../analysis.js";

export default function Method() {
  const C = {};
  D.forEach((d) => { C[d.p] = (C[d.p] || 0) + 1; });
  return (
    <div className="grid">
      <section className="card c7">
        <h2>Data sources and confidence</h2>
        <ul>
          <li><b>Panels:</b> metabolic ({C.Metabolic} analytes), cardiac cytokines ({C.Cardiac}), Eve immune cytokines ({C.Immune}) and the Alamar immune panel ({C.Alamar} proteins, NPQ log2 scale). {D.length} analytes, 4 crew, 7 sample times. NASA OSDR OSD-575, accessed 2 Oct 2026.</li>
          <li>One Alamar sample (C003 at L-44, a baseline sample) is missing, so C003's Alamar baseline uses 2 points. It is shown as n/a and never filled in.</li>
          <li>Baseline = the pre-flight samples (L-92, L-44, L-3). Confidence is <b>Low</b> for a one-time shift and <b>Medium</b> when it persists across samples.</li>
          <li>With only 3 baseline points, a normal value falls outside min–max about half the time by chance, so only shifts of one full range-width or more are flagged.</li>
          <li>Later samples (R+82, R+194) can reflect recovery, lab batch differences or lifestyle, not only flight effects.</li>
        </ul>
      </section>
      <section className="card c5">
        <h2>AI safety and transparency</h2>
        <ul>
          <li>Alerts are computed from your data by fixed, visible rules, not by a hidden model.</li>
          <li>Nothing here diagnoses a condition. A person decides; the medical officer reviews.</li>
          <li>Escalate needs a second click to confirm. Actions are recorded in this browser only.</li>
          <li>Code and logo were created with AI assistance (Claude).</li>
        </ul>
      </section>
      <section className="card c12">
        <h2>Roadmap</h2>
        <ul>
          <li>Connect the simulated-vitals anomaly models (Isolation Forest, autoencoder) from the Python project.</li>
          <li>Validate on real wearable data (WESAD, PhysioNet BIDMC) and report the results honestly.</li>
          <li>Clinical validation, consent and privacy review are required before any real use.</li>
        </ul>
      </section>
    </div>
  );
}
