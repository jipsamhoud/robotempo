import type { Variant } from "./pricing";

export const VARIANT_COOKIE = "rt_pv";

/**
 * Draait in <head> vóór de eerste paint. Wijst een prijsvariant toe (of leest ?pv=a|b),
 * onthoudt die een jaar in een functionele cookie van eerste partij en zet hem op <html data-pv>.
 * Legt ook de landingspagina en de UTM-bron van het eerste bezoek vast voor de aanvragen.
 */
export const variantBootScript = `(function(){try{
var q=new URLSearchParams(location.search),f=q.get('pv');
var m=document.cookie.match(/(?:^|; )${VARIANT_COOKIE}=(a|b)/);
var v=(f==='a'||f==='b')?f:(m?m[1]:(Math.random()<0.5?'a':'b'));
document.cookie='${VARIANT_COOKIE}='+v+';path=/;max-age=31536000;samesite=lax';
document.documentElement.setAttribute('data-pv',v);
if(!sessionStorage.getItem('rt_landing')){sessionStorage.setItem('rt_landing',location.pathname+location.search)}
if(q.get('utm_source')&&!sessionStorage.getItem('rt_utm')){sessionStorage.setItem('rt_utm',JSON.stringify({source:q.get('utm_source'),medium:q.get('utm_medium')||'',campaign:q.get('utm_campaign')||''}))}
}catch(e){}})();`;

export function getVariant(): Variant {
  if (typeof document === "undefined") return "a";
  return document.documentElement.getAttribute("data-pv") === "b" ? "b" : "a";
}

export interface Utm {
  source: string;
  medium: string;
  campaign: string;
}

export function getLandingPage(): string {
  try {
    return sessionStorage.getItem("rt_landing") ?? "";
  } catch {
    return "";
  }
}

export function getUtm(): Utm {
  try {
    const stored = sessionStorage.getItem("rt_utm");
    if (stored) return JSON.parse(stored) as Utm;
  } catch {}
  return { source: "", medium: "", campaign: "" };
}
