# Robotempo

De marketingsite van Robotempo, het uitzendbureau voor robots. Versie 1 is een vraagtest: laat zien of hotels, zorglocaties en beveiligingsklanten robots per uur willen inhuren, tegen welke prijs en voor welk werk. De pilots starten in het voorjaar van 2027.

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
npm test          # berekening configurator en validatie formulieren
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
src/data/robots.json        enige bron voor robots, tarieven en configurator
src/lib/pricing.ts          berekening uit de handoff §4, prijsvarianten, opmaak bedragen
src/lib/avatars.ts          de zes personages als data (SVG en Open Graph)
src/components/RobotAvatar  <RobotAvatar kind size /> — geef `src` mee voor een render of foto
src/messages/nl.ts          alle teksten. Voor /en: maak en.ts in dezelfde vorm
src/lib/lead.ts             vorm en validatie van een aanvraag, honeypot
src/lib/storage/            vervangbare opslag: airtable, console
src/app/api/lead/route.ts   één API-route voor alle formulieren
```

### Routes

`/`, `/robots`, `/robots/[slug]` (zes profielen uit `robots.json`), `/inhuren`, `/bedankt`, `/privacy`, `/fabrikanten`.

De configurator accepteert `?sector=hotel|zorg|beveiliging` voor een startploeg en `?robot=bram` vanaf een profiel.

### Prijstest

Een script in `<head>` wijst elke bezoeker variant A of B toe en onthoudt die een jaar in de functionele cookie `rt_pv`. B is 20% duurder. Statische pagina's bevatten beide prijzen; CSS toont de juiste, dus er flikkert niets. De variant gaat mee in elke aanvraag en elk event. Forceren: `?pv=a` of `?pv=b`.

### Events

`robot_profile_view` (slug), `filter_used` (sector), `configurator_start`, `crew_changed`, `request_submitted` (sector, robots, weekprijs), `pilot_signup`, `waitlist_signup` (slug), `manufacturer_signup`. Alle events krijgen `variant` mee.

## Open punten

- robotempo.com registreren, merkcheck Benelux en EU
- E-mailadres voor meldingen en het Airtable-account
- Echte beelden van de robots, via hetzelfde `RobotAvatar`-component
- Lighthouse- en WCAG-audit op de productie-URL
