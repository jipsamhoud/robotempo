import type { Metadata } from "next";
import { PageHero, PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description: "Wat Robotempo opslaat, waarom en hoe lang.",
};

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Wat we opslaan",
    body: (
      <>
        <p>Als je een formulier invult, slaan we op wat je invult: je naam, organisatie, soort locatie, e-mailadres en, als je die geeft, je telefoonnummer, plaats, het aantal kamers of bedden en het werk dat blijft liggen.</p>
        <p>Bij een aanvraag uit de configurator slaan we ook de sector op, de ploeg die je samenstelde met aantallen en diensten, en het maandbedrag dat je zag. Bij de flexpool de periode, het soort werk en het aantal robots. Daarnaast het tijdstip, de prijsvariant, de pagina waarop je binnenkwam en, als je via een campagne kwam, de bron, het medium en de campagnenaam uit de link.</p>
      </>
    ),
  },
  {
    title: "Waarom",
    body: <p>Om contact met je op te nemen over een pilot, een aanvraag, de flexpool of de wachtlijst. En om te leren welke robots, diensten en prijzen het meest gevraagd worden. We gebruiken je gegevens niet voor iets anders en verkopen ze aan niemand.</p>,
  },
  {
    title: "Hoe lang",
    body: <p>Tot het einde van de pilotfase, uiterlijk 31 december 2027. Word je klant, dan bewaren we je gegevens zolang we samenwerken en daarna zo lang als de wet vraagt. Daarna verwijderen we ze.</p>,
  },
  {
    title: "Cookies en meten",
    body: (
      <>
        <p>We zetten één functionele cookie, <code>rt_pv</code>. Die onthoudt een jaar lang welke prijsvariant je ziet, zodat je bij een volgend bezoek dezelfde prijzen ziet. Er staat geen persoonlijke informatie in.</p>
        <p>We meten bezoek met een dienst die geen cookies gebruikt en geen persoonsgegevens opslaat. Daarom is er geen cookiebanner.</p>
      </>
    ),
  },
  {
    title: "Wie je gegevens ziet",
    body: <p>Het team van Robotempo. We bewaren aanvragen bij een externe database-dienst en versturen meldingen via een e-maildienst. Met beide hebben we afspraken over de verwerking.</p>,
  },
  {
    title: "Je rechten",
    body: (
      <p>
        Je mag altijd vragen welke gegevens we van je hebben, ze laten aanpassen of laten verwijderen. Mail naar <a href="mailto:privacy@robotempo.com">privacy@robotempo.com</a>. We reageren binnen een maand. Ben je het er niet mee eens, dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <PageShell hero={<PageHero title="Privacy." intro="Wat we opslaan, waarom en hoe lang. Kort en volledig." />}>
      <div className="wrap flex max-w-[920px] flex-col gap-12 pb-20 pt-14 md:pb-[120px]">
        {SECTIONS.map((s) => (
          <section key={s.title} className="flex flex-col gap-3 border-t-2 border-ink pt-6 text-lg leading-[1.6] text-muted [&_p]:m-0 [&_p+p]:mt-3">
            <h2 className="m-0 text-[clamp(28px,3vw,40px)] font-black leading-none text-ink">{s.title}</h2>
            {s.body}
          </section>
        ))}
        <p className="m-0 text-sm text-muted-2">Laatst bijgewerkt: oktober 2026.</p>
      </div>
    </PageShell>
  );
}
