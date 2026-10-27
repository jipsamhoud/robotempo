# Handoff: website Robotempo v1

Bouw de eerste versie van robotempo.com: de marketingsite van Robotempo, het uitzendbureau voor robots. De site is een **vraagtest**. Hij moet in vier weken laten zien of hotels, zorglocaties en beveiligingsklanten robots per uur willen inhuren, tegen welke prijs, en voor welk werk. De pilots starten in het voorjaar van 2027. Er draaien nog geen robots bij klanten.

In deze map:

- `HANDOFF.md`: deze briefing
- `robots.json`: alle robotdata, tarieven en configurator-instellingen. De enige bron voor robots en prijzen
- `design/`: de ontwerpen als `.dc.html`. Lees ze als visuele spec: layout, maten, kleuren en teksten staan inline in de markup. Het formaat zelf hoef je niet te draaien

| Ontwerpbestand | Pagina |
|---|---|
| `design/Main.dc.html` | Home, **de leidende stijl** |
| `design/Robots.dc.html` | Overzicht van de robots, met filter |
| `design/Profiel-Bram.dc.html` | Robotprofiel, voorbeeld voor alle zes |
| `design/Samenstellen.dc.html` | Configurator in drie stappen |
| `design/Mobiel.dc.html` | Home op mobiel |
| `design/RobotAvatar.dc.html` | De zes robotpersonages als SVG |

Belangrijk: alleen de home heeft de definitieve stijl. Robots, profiel, configurator en mobiel hebben de juiste structuur en inhoud, maar een oudere, lichtere stijl. **Trek de stijl van de home door naar alle pagina's.**

## 1. Merk en stijl

- **Naam:** Robotempo. Ondertitel: "Het uitzendbureau voor robots".
- **Gevoel:** een gevestigd uitzendbureau, al jaren groot. Niet een techstartup. Vol vlak, grote zware koppen, zelfverzekerd.
- **Lettertypes:** Archivo 800 en 900 voor koppen en het woordmerk, Inter 400 tot 700 voor tekst. Beide via Google Fonts, of zelf gehost.
- **Kleuren:**

| Token | Waarde | Gebruik |
|---|---|---|
| `brand` | #FF5A1F | Hero-vlak, belofte-vlak, accenten, cijfers |
| `ink` | #111111 | Tekst, knoppen, banden, footer |
| `paper` | #FFFFFF | Achtergrond |
| `stone` | #F3F2EF | Rustige secties |
| `muted` | #3D3D3D en #575757 | Lopende tekst en bijschriften |
| Sector hotel | #C9D8FF | Sectortegel |
| Sector zorg | #BFEBD8 | Sectortegel |
| Sector beveiliging | #16233A met #F2B705 | Sectortegel |

Elke robot heeft eigen kleuren in `robots.json`: `tint` voor de achtergrond, `band` en `bandText` voor de kop van de personeelspas.

- **Koppen:** tot 168px op desktop, met `clamp()`. Regelafstand 0,86 tot 0,95, letterafstand −0,035em.
- **Knoppen:** pilvormig, 18px, vet. Primair zwart op oranje of wit, secundair wit.
- **Randen:** kaarten met 2px zwarte rand en radius 26px. Sectortegels radius 32px, zonder rand.
- **Toon:** rustig, korte zinnen, licht humoristisch in de robotprofielen. Geen hype, geen beloftes die niet gemeten zijn.

## 2. De robots als personages

De robots zijn medewerkers. Elke robot heeft een naam, een functie, een dienst, een uurtarief, een personeelsnummer en een profiel van wat hij kan en **niet** kan. Alles staat in `robots.json`.

| Robot | Functie | Status | Tarief |
|---|---|---|---|
| Bram | Vloerspecialist | Beschikbaar | €8,25 per uur |
| Mila | Roomservice | Beschikbaar | €4,95 per uur |
| Joop | Rondebrenger | Beschikbaar | €5,50 per uur |
| Wout | Nachtwaker | Beschikbaar | €18 per uur, met meldkamer |
| Fenna | Lobbyhost | Pilot | Op aanvraag |
| Rik | Allrounder, humanoïde | Wachtlijst | Nog niet te huren |

**Personages als component.** Zet de SVG's uit `design/RobotAvatar.dc.html` om naar één component, `<RobotAvatar kind size />`. De figuur staat altijd op de onderkant van zijn vak. De `size` is de breedte en hoogte in px. Maak het component zo dat de SVG's later één op één te vervangen zijn door 3D-renders of foto's: dezelfde props, een andere bron.

## 3. Pagina's en routes

| Route | Pagina | Inhoud |
|---|---|---|
| `/` | Home | Zie hieronder |
| `/robots` | Onze robots | Lijst als vacaturebank. Filter: alle, hotels, zorg, beveiliging. Per robot: personage, functie, status, pitch, tags, dienst, tarief, knoppen "Bekijk profiel" en "[Naam] inhuren" |
| `/robots/[slug]` | Robotprofiel | Zes pagina's, één per robot, uit `robots.json`. Opbouw zoals `Profiel-Bram`: personage, kerngegevens, intro in de ik-vorm, wat ik kan, wat ik (nog) niet doe, met wie ik samenwerk, een voorbeeldweek met kosten, en een blok "Referenties" dat zegt dat die na de pilots komen. Bij Fenna en Rik: geen voorbeeldweek, wel een aanmeldknop voor pilot of wachtlijst |
| `/inhuren` | Stel je ploeg samen | De configurator, zie §4 |
| `/bedankt` | Bevestiging | Na elk formulier |
| `/privacy` | Privacyverklaring | Wat we opslaan, waarom en hoe lang |

**De home, van boven naar beneden:**
1. Oranje hero met navigatie, de kop "Het uitzendbureau voor robots.", de introductietekst, twee knoppen, en een rij van alle zes robots die op een zwarte band staan. Namen en functies staan in die band.
2. Zwarte band met diensten: Nachtschoonmaak, Roomservice, Maaltijdronde, Linnen, Nachtronde, Ontvangst.
3. "Maak kennis met de ploeg": zes personeelspassen met medewerkernummer, status, personage, naam, functie, dienst, tarief en een decoratieve barcode. Elke pas linkt naar het profiel.
4. "Waar onze robots werken": drie sectortegels, hotels, zorg en beveiliging, elk met hun robots en een link naar de configurator met die sector voorgeselecteerd.
5. Werkwijze in drie stappen: 01 Kies je robot, 02 Kies je uren, 03 Wij regelen de rest.
6. Oranje belofteblok: "We verkopen geen robots. We verkopen uren werk dat af is." met drie garanties.
7. "Eerlijk over wat een robot kan": kan het al, en kan het (nog) niet.
8. Zwart pilotblok: "Tien plekken. Wie wil er eerst?" met aanmeldformulier.
9. Footer met vier kolommen en het woordmerk heel groot. In de footer ook "Ben je fabrikant? Schrijf je robot in", met een link naar een eenvoudig formulier voor fabrikanten.

## 4. Configurator `/inhuren`

**Stap 1, kiezen.** Bram, Mila, Joop en Wout, elk 0 tot 5 stuks, met plus- en minknoppen. Een dienst: nacht 8 uur, dag 12 uur, of rond de klok 20 uur. Dagen per week: 7 of 5. Rechts een vast overzicht dat meeschuift.

**Berekening.** Alle waarden komen uit `robots.json`:

```
uren_robot_week   = aantal × uren_per_dienst × dagen
kosten_week       = Σ uren_robot_week × rate
kosten_maand      = kosten_week × 52 / 12
vermeden_inhuur   = Σ uren_robot_week × productivity × baseRates[baseRate] × avoidedFactor
```

Toon de kosten per week groot, en daaronder per maand en het aantal robouren. Toon apart: "Inhuur die je naar schatting niet meer nodig hebt: €X per week", met deze uitleg eronder: "Indicatie op basis van een uitzendtarief van €31,50, een nachtbeveiliger van €52 en wat een robot per uur doet ten opzichte van een mens, voorzichtig gehalveerd. In de pilot meten we jouw werkelijke besparing." Bedragen in euro's, afgerond, met een punt als duizendtalscheiding.

**Stap 2, gegevens.** Naam, organisatie en plaats, soort locatie (hotel, zorglocatie, bedrijventerrein of beveiliging, vakantiepark, anders), aantal kamers, bedden of m², "Welk werk blijft nu liggen?", e-mail en telefoon. Rechts de gekozen ploeg.

**Stap 3, bevestiging.** "Bedankt. Je ploeg staat klaar om kennis te maken. We bellen je binnen twee werkdagen."

De querystring `?sector=hotel|zorg|beveiliging` zet een logische startploeg klaar: hotel 2 Bram en 1 Mila, zorg 1 Bram en 2 Joop, beveiliging 2 Wout met nachtdienst.

## 5. Formulieren en opslag

Drie formulieren: pilotaanmelding op de home, aanvraag uit de configurator, en wachtlijst of pilot voor Fenna en Rik. Plus het fabrikantenformulier.

- Elk formulier gaat naar één API-route met validatie en een honeypot tegen spam.
- Sla aanvragen op via een vervangbare adapter. Begin met **Airtable**, met de sleutels als omgevingsvariabelen. Lokaal schrijft de adapter naar de console.
- Stuur bij elke aanvraag een melding per e-mail naar een vast adres, bijvoorbeeld via Resend.
- Sla per aanvraag op: formulier, alle velden, de gekozen ploeg met dienst en dagen, de berekende weekprijs, de prijsvariant (§6), UTM-bron, medium en campagne, en het tijdstip.

## 6. Prijstest

Wijs elke bezoeker willekeurig een van twee varianten toe, en onthoud die in een cookie van eerste partij:

- **A:** tarieven uit `robots.json`
- **B:** dezelfde tarieven plus 20%

De variant geldt overal waar een prijs staat, en gaat mee in elke aanvraag en elk event. Met `?pv=a` of `?pv=b` kun je een variant forceren om te testen.

## 7. Meten

Plausible, of een andere analyticsdienst zonder cookies, zodat er geen cookiebanner nodig is. De variant-cookie is functioneel.

Events: `robot_profile_view` (slug), `filter_used` (sector), `configurator_start`, `crew_changed`, `request_submitted` (sector, robots, weekprijs, variant), `pilot_signup`, `waitlist_signup` (slug), `manufacturer_signup`.

## 8. Techniek en kwaliteit

- Next.js met App Router en TypeScript, Tailwind met de tokens uit §1, gehost op Vercel. De pagina's statisch waar dat kan.
- Nederlands in v1. Zet de structuur klaar voor Engels (`/en`), met alle teksten in één berichtenbestand per taal.
- Laadtijd onder twee seconden op mobiel, Lighthouse 90+ op alle vier de onderdelen.
- Toegankelijk volgens WCAG AA: echte knoppen en links, labels bij elk veld, contrast 4,5:1, alles met het toetsenbord te bedienen, SVG's met een `aria-label`.
- Werkt vanaf 360px breed. De robotrij in de hero wordt op mobiel een horizontaal scrollende rij, of toont drie robots.
- Meta-tags en een Open Graph-afbeelding per pagina: de robotrij op oranje.

## 9. Inhoudelijke regels

- **Geen verzonnen bewijs.** Geen reviews, klantlogo's, "bekend van", aantallen klanten of resultaten. Die bestaan nog niet.
- **Geen beloftes over wat niet bewezen is.** Elke robot toont wat hij niet kan. Rik is bewust "in opleiding".
- **Elk cijfer met een bron.** Gebruik op de site alleen de cijfers uit dit document en de ontwerpen.
- **Geen merknamen van fabrikanten** op de site. Robotempo werkt met meerdere merken.
- Overal staat dat het om pilots in 2027 gaat.

## 10. Klaar als

- [ ] Alle routes uit §3 werken, de zes profielen worden gemaakt uit `robots.json`
- [ ] De stijl van de home staat op elke pagina
- [ ] De configurator rekent precies volgens §4, met tests voor de berekening
- [ ] Alle formulieren slaan op, sturen een e-mail en eindigen op `/bedankt`
- [ ] De prijsvariant wordt toegewezen, onthouden, getoond en opgeslagen
- [ ] Alle events uit §7 komen binnen
- [ ] Werkt goed van 360px tot 1920px breed
- [ ] Lighthouse 90+ en WCAG AA
- [ ] Een README met lokaal draaien, de omgevingsvariabelen en het deployen

## Open punten, niet blokkerend

- robotempo.com registreren, en de merkcheck in de Benelux en de EU
- E-mailadres voor meldingen en het Airtable-account
- Echte beelden: de SVG-personages zijn een eerste versie. Later komen 3D-renders of fotografie van de robots, via hetzelfde component
