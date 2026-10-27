# Robotempo

De marketingsite van Robotempo, het uitzendbureau voor robots. Versie 1 is een vraagtest: laat in vier weken zien of hotels, zorglocaties en beheerders van terreinen robots willen inhuren, tegen welke prijs en voor welk werk. De pilots starten in het voorjaar van 2027.

**Demo:** https://jipsamhoud.github.io/robotempo/ (statische versie op GitHub Pages)

De briefing en de ontwerpen staan in [`handoff/`](handoff/HANDOFF.md).

## Lokaal draaien

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Zonder sleutels schrijft de API-route aanvragen naar de console.

```bash
npm test          # de drie prijsmodellen, prijsvariant B en validatie formulieren
npm run typecheck
npm run build     # productiebuild met API-route (Vercel)
npm run build:pages  # statische demo in out/ (GitHub Pages)
```

## Omgevingsvariabelen

| Variabele | Waarvoor |
|---|---|
| `STORAGE_ADAPTER` | `airtable` of `console`. Standaard `airtable` als er een sleutel is, anders `console` |
| `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE` | Opslag van aanvragen. Tabel standaard `Aanvragen` |
| `RESEND_API_KEY`, `NOTIFY_EMAIL_TO`, `NOTIFY_EMAIL_FROM` | E-mailmelding bij elke aanvraag |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Analytics zonder cookies. Leeg: events gaan naar de console |
| `NEXT_PUBLIC_SITE_URL` | Volledige URL, voor Open Graph |
| `NEXT_PUBLIC_BASE_PATH` | Alleen voor GitHub Pages (`/robotempo`) |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Alleen voor GitHub Pages: formulieren als e-mail via Web3Forms. In de workflow uit de repository-variabele `WEB3FORMS_KEY` |

In Airtable maakt de adapter de velden met `typecast` aan: formulier, alle velden, ploeg, dienst, dagen per week, weekprijs, prijsvariant, UTM bron, medium en campagne, tijdstip, plus de volledige aanvraag als JSON.

## Deployen

**Productie op Vercel.** Importeer de repository, zet de omgevingsvariabelen en deploy. Alle pagina's zijn statisch, alleen `/api/lead` draait op de server.

**Op GitHub Pages.** Elke push naar `main` bouwt via [`.github/workflows/pages.yml`](.github/workflows/pages.yml) een statische export. GitHub Pages kan geen API-routes draaien, dus `scripts/build-pages.mjs` zet de route even opzij. Staat er een repository-variabele `WEB3FORMS_KEY`, dan gaat elk formulier via [Web3Forms](https://web3forms.com) als e-mail naar de inbox, met alle velden, de ploeg, de weekprijs, de variant en de UTM-bron. Zonder sleutel draaien de formulieren in demomodus en wordt er niets verstuurd.

## Hoe het in elkaar zit

```
src/data/robots.json        enige bron voor robots, prijsmodellen en configurator
src/data/media.ts           echte foto's en video's per robot (Rex), zodra ze er zijn
src/lib/pricing.ts          berekening uit de handoff §5, prijsvariant B, opmaak bedragen
src/lib/avatars.ts          de zeven personages als data (SVG en Open Graph)
src/components/RobotAvatar  <RobotAvatar kind size />, met `src` voor een render of foto
src/components/RobotMedia   kiest video, foto of personage uit media.ts
src/messages/nl.ts          alle teksten. Voor /en: maak en.ts in dezelfde vorm
src/lib/lead.ts             vorm en validatie van een aanvraag, honeypot
src/lib/storage/            vervangbare opslag: airtable, console
src/app/api/lead/route.ts   één API-route voor alle formulieren
```

### Routes

`/`, `/robots`, `/robots/[slug]` (zeven profielen uit `robots.json`), `/hotels`, `/zorg`, `/beveiliging`, `/inhuren`, `/flexpool`, `/fabrikanten`, `/bedankt`, `/privacy`.

De configurator begint met de sector. `?sector=hotel|zorg|beveiliging` zet die vooraf met de standaardploeg uit `robots.json`; `?robot=bram` vanaf een profiel kiest de sector van die robot.

### Prijsmodellen

| Model | Robots | Per maand |
|---|---|---|
| Per schone nacht | Bram | aantal × nachten per week × 4,33 × prijs |
| Per dienstuur | Wout | aantal × uren per nacht × nachten per week × 4,33 × prijs |
| Per maand | Mila, Joop | aantal × prijs |

Vermeden inhuur rekent met dezelfde formule en `avoidedPerUnit`. Rex en Fenna (pilot) en Rik (wachtlijst) tellen niet mee.

### Prijstest

Een script in `<head>` wijst elke bezoeker variant A of B toe en onthoudt die een jaar in de functionele cookie `rt_pv`. B is 20% duurder, afgerond op hele euro's, of op €0,50 bij het uurtarief. Statische pagina's bevatten beide prijzen; CSS toont de juiste, dus er flikkert niets. De variant gaat mee in elke aanvraag en elk event. Forceren: `?pv=a` of `?pv=b`.

Hetzelfde script onthoudt de landingspagina van het bezoek. Die gaat mee in elke aanvraag.

### Events

`robot_profile_view` (slug), `sector_page_view` (sector), `filter_used` (sector), `configurator_start` (sector), `crew_changed`, `request_submitted` (sector, robots, maandbedrag), `pilot_signup` (slug, of `algemeen` vanaf de home), `waitlist_signup` (slug), `flexpool_request`, `manufacturer_signup`. Alle events krijgen `variant` mee.

### Overzicht in Airtable

Het doel van de test: minstens 20 serieuze aanvragen in vier weken, waarvan minstens 5 zorglocaties en 5 terreinen. Maak in de tabel `Aanvragen` drie weergaven, gegroepeerd op `Sector`, `Prijsvariant` en `Landingspagina`, met een telling per groep. Zolang de site op GitHub Pages draait, komen aanvragen per e-mail binnen via Web3Forms, met dezelfde velden.

## Open punten

- robotempo.com registreren, merkcheck Benelux en EU
- E-mailadres voor meldingen en het Airtable-account
- Naam van de beveiligingspartner
- Foto en video van Rex: zet ze in `public/media` en vul `src/data/media.ts` in
- Echte beelden van de andere robots, via hetzelfde `RobotAvatar`-component
- Lighthouse- en WCAG-audit op de productie-URL
