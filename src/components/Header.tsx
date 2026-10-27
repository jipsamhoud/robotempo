"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { t } from "@/messages";
import { Logo } from "./Logo";

const links = [
  { href: "/robots", label: t.nav.robots },
  { href: "/hotels", label: t.nav.hotels },
  { href: "/zorg", label: t.nav.zorg },
  { href: "/beveiliging", label: t.nav.beveiliging },
  { href: "/flexpool", label: t.nav.flexpool },
];

/** De kop van elke pagina, op oranje. */
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  const current = (href: string) => pathname === href || pathname === `${href}/` || pathname.startsWith(`${href}/`);

  return (
    <header className="bg-brand">
      <div className="wrap flex flex-wrap items-center justify-between gap-4 py-[22px]">
        <Logo />
        <button
          type="button"
          className="flex size-12 items-center justify-center rounded-[14px] border-2 border-ink bg-paper lg:hidden"
          aria-expanded={open}
          aria-controls="hoofdmenu"
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
        <nav
          id="hoofdmenu"
          aria-label={t.nav.label}
          className={`${open ? "flex" : "hidden"} w-full flex-col gap-1 pb-2 text-lg font-semibold lg:flex lg:w-auto lg:flex-row lg:flex-wrap lg:items-center lg:gap-7 lg:pb-0 lg:text-base`}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={current(l.href) ? "page" : undefined}
              className="py-2 no-underline aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-4 lg:py-0"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/inhuren" className="btn mt-2 bg-ink px-[22px] py-3.5 text-base text-white hover:text-white lg:mt-0">
            {t.nav.hire}
          </Link>
        </nav>
      </div>
    </header>
  );
}
