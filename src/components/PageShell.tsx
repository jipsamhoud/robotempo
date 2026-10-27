import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

/** Kop, inhoud en footer voor elke pagina behalve de home. */
export function PageShell({ children, hero }: { children: ReactNode; hero?: ReactNode }) {
  return (
    <>
      <div className="bg-brand">
        <Header />
        {hero}
      </div>
      <main id="inhoud">{children}</main>
      <Footer />
    </>
  );
}

/** Oranje kopblok in de stijl van de home. */
export function PageHero({ title, intro, children }: { title: string; intro?: ReactNode; children?: ReactNode }) {
  return (
    <div className="wrap flex flex-col gap-6 pb-12 pt-8 sm:pt-12 md:pb-16">
      <h1 className="m-0 max-w-[1100px] text-[clamp(52px,8vw,128px)] font-black leading-[0.88]">{title}</h1>
      {intro && <p className="m-0 max-w-[640px] text-xl font-medium leading-[1.4] sm:text-[22px]">{intro}</p>}
      {children}
    </div>
  );
}
