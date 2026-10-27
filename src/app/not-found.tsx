import Link from "next/link";
import { PageHero, PageShell } from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell hero={<PageHero title="Deze pagina werkt hier niet." intro="Misschien is hij verplaatst. De robots zijn er nog wel.">
      <div><Link href="/robots" className="btn bg-ink text-white hover:text-white">Bekijk onze robots</Link></div>
    </PageHero>}>
      {null}
    </PageShell>
  );
}
