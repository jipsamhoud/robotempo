import Link from "next/link";
import { t } from "@/messages";

export function Footer() {
  const col = "flex flex-col gap-2.5";
  const link = "text-[#CFCFCF] no-underline hover:text-white";
  return (
    <footer className="on-dark border-t border-[#2A2A2A] bg-ink text-[#CFCFCF]">
      <div className="wrap flex flex-col gap-14 pb-10 pt-[72px]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 text-base">
          <div className={col}>
            <h2 className="font-sans text-base font-bold tracking-normal text-white">{t.footer.services}</h2>
            {t.footer.serviceLinks.map((s) => (
              <Link key={s} href="/robots" className={link}>{s}</Link>
            ))}
          </div>
          <div className={col}>
            <h2 className="font-sans text-base font-bold tracking-normal text-white">{t.footer.sectors}</h2>
            <Link href="/robots?sector=hotel" className={link}>{t.sectors.hotel}</Link>
            <Link href="/robots?sector=zorg" className={link}>{t.sectors.zorg}</Link>
            <Link href="/robots?sector=beveiliging" className={link}>{t.sectors.beveiliging}</Link>
          </div>
          <div className={col}>
            <h2 className="font-sans text-base font-bold tracking-normal text-white">{t.footer.company}</h2>
            <Link href="/#belofte" className={link}>{t.footer.promise}</Link>
            <Link href="/#pilot" className={link}>{t.footer.pilot}</Link>
            <a href="mailto:hallo@robotempo.com" className={link}>{t.footer.contact}</a>
            <Link href="/privacy" className={link}>{t.footer.privacy}</Link>
          </div>
          <div className={col}>
            <h2 className="font-sans text-base font-bold tracking-normal text-white">{t.manufacturer.footerTitle}</h2>
            <p className="m-0">{t.manufacturer.footerText}</p>
            <Link href="/fabrikanten" className="font-bold text-brand hover:text-white">{t.manufacturer.footerCta}</Link>
          </div>
        </div>
        <p className="m-0 text-sm text-[#A8A8A8]">{t.footer.note}</p>
        <div aria-hidden="true" className="font-display text-[clamp(56px,15vw,156px)] font-black leading-[0.85] tracking-[-0.045em] text-white md:text-[clamp(56px,9.5vw,156px)]">
          Robotempo
        </div>
      </div>
    </footer>
  );
}
