import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import { AppProvider, useApp } from "./store.jsx";
import { TP, CREW } from "./analysis.js";
import Home from "./pages/Home.jsx";
import Explorer from "./pages/Explorer.jsx";
import Alerts from "./pages/Alerts.jsx";
import Crew from "./pages/Crew.jsx";
import Method from "./pages/Method.jsx";

const NAV = [["/", "Home", "🏠"], ["/biomarkers", "Biomarkers", "🧬"], ["/alerts", "Alerts", "🚨"], ["/crew", "Crew overview", "👩‍🚀"], ["/method", "Method and safety", "🛡️"]];

function Selector() {
  const { c, t, set } = useApp();
  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div className="row" role="group" aria-label="Crew">
        <b style={{ marginRight: 6 }}>Crew</b>
        {CREW.map((k) => <button key={k} className={k === c ? "on" : ""} onClick={() => set({ c: k })}>{k}</button>)}
      </div>
      <div className="tl" style={{ marginTop: 10 }} role="group" aria-label="Sample time">
        <b style={{ marginRight: 6 }}>Sample</b>
        {TP.map((x, i) => (
          <span key={x} style={{ display: "contents" }}>
            <button className={i === t ? "on" : ""} onClick={() => set({ t: i })}>{x}</button>
            {i === 2 && <span className="gap">🚀 3-day flight</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="app">
          <aside className="side">
            <div className="brand"><img src="logo.png" width="38" height="38" alt="VitalGuard logo" /><b>Vital<span>Guard</span></b></div>
            {NAV.map(([to, n, i]) => (
              <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => "nl" + (isActive ? " cur" : "")}>{i} {n}</NavLink>
            ))}
            <p className="sub" style={{ marginTop: "auto" }}>NASA OSD-575 · decision support, not a diagnosis · logo and code made with AI assistance (Claude)</p>
          </aside>
          <main className="main"><div className="wrap">
            <Selector />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/biomarkers" element={<Explorer />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/crew" element={<Crew />} />
              <Route path="/method" element={<Method />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </div></main>
        </div>
      </HashRouter>
    </AppProvider>
  );
}
