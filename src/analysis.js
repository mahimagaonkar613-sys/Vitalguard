import { D } from "./data.js";
export { D };
export const TP=["L-92","L-44","L-3","R+1","R+45","R+82","R+194"],CREW=["C001","C002","C003","C004"];
export const st=(a,c)=>{const v=D[a].v[c],pre=v.slice(0,3).filter(x=>x!=null),mn=Math.min(...pre),mx=Math.max(...pre),me=pre.reduce((p,q)=>p+q,0)/pre.length;return{v,mn,mx,me,sp:Math.max(mx-mn,(D[a].p=='Alamar'?.02:.05)*me)}};
export const sh=(a,c,i)=>{const s=st(a,c),x=s.v[i];if(x==null)return 0;return x>s.mx?(x-s.mx)/s.sp:x<s.mn?(s.mn-x)/s.sp:0};
export const pc=(a,c,i)=>{const s=st(a,c);return D[a].p=='Alamar'?100*(Math.pow(2,s.v[i]-s.me)-1):100*(s.v[i]-s.me)/s.me};
export const dir=(a,c,i)=>{const s=st(a,c);return s.v[i]>s.mx?"above":"below"};
export const idx=(c,i)=>Math.round(100*D.reduce((n,_,a)=>n+(sh(a,c,i)>=1),0)/D.filter(d=>d.v[c][i]!=null).length);
export const sev=s=>s>=4?3:s>=2?2:1;
export const SN=["","Observe","Attention","Review suggested"],SI=["","◇","▲","■"];
export const fx=x=>x==null||isNaN(x)?"n/a":Math.abs(x)>=100?x.toFixed(0):Math.abs(x)>=10?x.toFixed(1):x.toFixed(2);
export function persist(a,c,i){let n=0;while(i>=3&&sh(a,c,i)>=1){n++;i--}return n}
export function alertsFor(c,i){if(i<3)return[];return D.map((_,a)=>a).filter(a=>sh(a,c,i)>=1).sort((x,y)=>sh(y,c,i)-sh(x,c,i))}
