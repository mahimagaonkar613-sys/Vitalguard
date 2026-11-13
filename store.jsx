import { createContext, useContext, useEffect, useState } from "react";
const Ctx = createContext(null);
const load = () => { try { return JSON.parse(localStorage.getItem("vg-react")) || {}; } catch { return {}; } };
export function AppProvider({ children }) {
  const [s, setS] = useState(() => ({ c: "C001", t: 3, a: 0, oth: false, q: "", dis: {}, mon: {}, esc: {}, ...load() }));
  const [msg, setMsg] = useState("");
  useEffect(() => { try { localStorage.setItem("vg-react", JSON.stringify(s)); } catch {} }, [s]);
  const set = (p) => setS((o) => ({ ...o, ...p }));
  const toast = (m) => { setMsg(m); clearTimeout(window.__vgt); window.__vgt = setTimeout(() => setMsg(""), 2600); };
  return (
    <Ctx.Provider value={{ ...s, set, toast }}>
      {children}
      <div id="toast" className={msg ? "show" : ""} role="status">{msg}</div>
    </Ctx.Provider>
  );
}
export const useApp = () => useContext(Ctx);
