# Handoff: website Robotempo v1

Bouw de eerste versie van robotempo.com: de marketingsite van Robotempo, het uitzendbureau voor robots.

De site is een **vraagtest**. Hij moet in vier weken laten zien of hotels, zorglocaties en beheerders van terreinen robots willen inhuren, tegen welke prijs, en voor welk werk. De pilots starten in het voorjaar van 2027. Er draaien nog geen robots bij klanten.

In deze map:

- `HANDOFF.md`: deze briefing. **Bij verschillen met de ontwerpen gaat deze briefing voor.**
- `robots.json`: alle robots, prijsmodellen en configurator-instellingen. De enige bron voor robots en prijzen.
- `design/`: de ontwerpen als `.dc.html`. Lees ze als visuele spec: layout, maten, kleuren en teksten staan inline in de markup. Het formaat zelf hoef je niet te draaien.

| Ontwerpbestand | Pagina |
|---|---|
| `design/Main.dc.html` | Home, **de leidende stijl** |
| `design/Robots.dc.html` | Overzicht van de robots, met filter |
| `design/Profiel-Bram.dc.html` | Robotprofiel, voorbeeld voor alle zeven |
| `design/Samenstellen.dc.html` | Configurator. **Structuur ja, prijslogica nee**: gebruik §5 |
| `design/Mobiel.dc.html` | Home op mobiel |
| `design/RobotAvatar.dc.html` | De zeven robotpersonages als SVG |

Alleen de home heeft de definitieve stijl. **Trek de stijl van de home door naar alle pagina's.**

---

## 1. Wat je moet weten over het bedrijf

Deze inzichten bepalen de teksten en de logica. Zet ze niet letterlijk op de site, maar bouw ernaar.

1. **Robotempo verkoopt werk, geen robots.** De klant koopt een schone vloer, een bewaakte nacht of een vaste kracht. Welke robot het doet, maakt hem niet uit. Robotempo werkt met robots van meerdere fabrikanten en noemt geen merken.
2. **Elke sector rekent anders af, zoals de klant nu ook inkoopt.**
   - Schoonmaak **per schone nacht.** Een schoonmaakrobot is na drie tot vier uur klaar. Per uur afrekenen zou een trage robot belonen.
   - Beveiliging **per dienstuur.** Een bewaker wordt nu ook per uur ingehuurd, en de robot werkt de hele dienst.
   - Bezorgen en ontvangst **per maand.** Een bezorgrobot staat vaak te wachten, net als een receptionist. Je betaalt voor beschikbaarheid.
3. **Eerlijk over wat robots kunnen.** Robots doen smalle, herhalende taken goed. Elke robot laat zien wat hij níet kan. Robotempo plaatst alleen robots op werk dat ze aantoonbaar kunnen. Dit eerlijke profiel is een deel van het merk.
4. **Mens en robot samen.** Het aanbod is een gemengde ploeg: de robot doet het herhalende werk, een mens de rest. Bijvoorbeeld een schoonmaker voor randen, vlekken en toiletten, of één mobiele beveiliger voor twee terreinen in plaats van een beveiliger per terrein.
5. **Bij beveiliging ziet en meldt de robot, maar grijpt hij niet in.** Zo werkt de keten:
   1. De robot loopt de ronde en ziet een persoon, warmte, een open hek of rook.
   2. De meldkamer kijkt live mee via de camera en vangt valse meldingen af.
   3. De meldkamer spreekt via de luidspreker van de robot.
   4. Bij een echte melding rukt een mobiele beveiliger uit.
   5. Bij inbraak of geweld volgt de politie.

   De meldkamer, de beveiliger en de vergunning komen van een **beveiligingspartner met vergunning**. Dat moet duidelijk op de site staan.
6. **Beveiliging begint op afgesloten terreinen:** logistieke parken, afgesloten bedrijventerreinen met eigen wegen, bouwplaatsen en parkeergarages. Niet in de openbare ruimte, vanwege privacy en de wet. Op een terrein met meerdere huurders kan één robot meerdere bedrijven bewaken. Dat is een sterk verkoopargument voor parkbeheerders en eigenaren van logistieke parken.
7. **Een vloot die meebeweegt.** Robotempo heeft een **flexpool**: extra robots voor een drukke week, zoals een congres, het hoogseizoen, of een uitbraak in een verpleeghuis waar extra gereinigd moet worden. Dezelfde pool dient als vervanging als een robot uitvalt.
8. **Rex, de robothond, is het gezicht van de beveiliging.** Hij loopt waar wielen niet komen: grind, modder, trappen, bouwplaatsen. Hij staat in pilot. Wout op wielen doet het gewone werk: lange vlakke rondes. Intern is Rex gebaseerd op een robothond in de klasse van de Unitree B2: waterdicht, 4 tot 6 uur per lading, kan trappen op. Noem dat merk niet op de site, maar laat het personage er wel op lijken: een stevige, industriële hond, geen speelgoed.

## 2. Merk en stijl

- **Naam:** Robotempo. Ondertitel: "Het uitzendbureau voor robots".
- **Gevoel:** een gevestigd uitzendbureau, al jaren groot. Geen techstartup. Vlakke kleur, grote zware koppen, zelfverzekerd.
- **Lettertypes:** Archivo 800 en 900 voor koppen en het woordmerk, Inter 400 tot 700 voor tekst.
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
- **Koppen:** tot 168px op desktop met `clamp()`, regelafstand 0,86 tot 0,95, letterafstand −0,035em.
- **Knoppen:** pilvormig, 18px, vet.
- **Kaarten:** 2px zwarte rand, radius 26px. Sectortegels radius 32px, zonder rand.
- **Toon:** rustig, korte zinnen, licht humoristisch in de profielen. Geen hype. Geen streepjes als onderbreking in zinnen: gebruik komma's, dubbele punten of een nieuwe zin.

## 3. De robots

Zeven personages, met alles in `robots.json`.

| Robot | Functie | Sector | Prijs | Status |
|---|---|---|---|---|
| Bram | Vloerspecialist | Hotel, zorg | Vanaf €75 per schone nacht | Beschikbaar |
| Mila | Roomservice | Hotel | €1.650 per maand | Beschikbaar |
| Joop | Rondebrenger | Zorg | €2.250 per maand | Beschikbaar |
| Wout | Nachtwaker | Beveiliging | €18 per robot per dienstuur | Beschikbaar |
| Rex | Terreinspecialist, robothond | Beveiliging | Op aanvraag | Pilot |
| Fenna | Lobbyhost | Hotel | Op aanvraag | Pilot |
| Rik | Allrounder, humanoïde | Hotel, zorg | Nog niet te huren | Wachtlijst |

"Beschikbaar" betekent: beschikbaar voor de pilots in 2027. Zeg dat overal waar een status staat.

**Personages als component.** Zet de SVG's uit `design/RobotAvatar.dc.html` om naar één component, `<RobotAvatar kind size />`. De figuur staat altijd op de onderkant van zijn vak, met een zachte schaduw. Bouw het zo dat de SVG's later één op één te vervangen zijn door 3D-renders of foto's.

**Foto en video van Rex.** Er komt een echte robothond als mascotte voor foto, video en evenementen. Maak in de hero en op `/beveiliging` een plek voor een video of foto. Gebruik tot die er is het SVG-personage.

## 4. Pagina's en routes

| Route | Pagina | Inhoud |
|---|---|---|
| `/` | Home | Zie hieronder |
| `/robots` | Onze robots | Lijst zoals een vacaturebank. Filter op alle, hotels, zorg en beveiliging. Per robot: personage, functie, status, pitch, tags, dienst, prijs, en de knoppen "Bekijk profiel" en "[Naam] inhuren" of "Meedoen aan de pilot" |
| `/robots/[slug]` | Robotprofiel | Zeven pagina's uit `robots.json`, opgebouwd zoals `Profiel-Bram`: personage, kerngegevens met prijs en prijsuitleg (`priceScope`), intro in de ik-vorm, wat ik kan, wat ik (nog) niet doe, met wie ik samenwerk (`pairing`), en een blok "Referenties" dat zegt dat die na de pilots komen. Bij pilot- en wachtlijstrobots een aanmeldformulier in plaats van een prijs |
| `/hotels` | Sectorpagina | Voor LinkedIn-campagnes op hotels. Bram, Mila, Fenna en de flexpool. Knop naar `/inhuren?sector=hotel` |
| `/zorg` | Sectorpagina | Voor campagnes op zorg. Joop en Bram. "Meer handen aan het bed." Knop naar `/inhuren?sector=zorg` |
| `/beveiliging` | Sectorpagina | Voor campagnes op parkbeheerders, logistieke parken en bouw. Wout en Rex, de keten uit §1.5 als vijf stappen, voor wie het is (§1.6), de beveiligingspartner met vergunning, en een FAQ. Knop naar `/inhuren?sector=beveiliging` |
| `/inhuren` | Stel je ploeg samen | De configurator, zie §5 |
| `/flexpool` | Extra robots voor een drukke week | Kort formulier: sector, periode, soort werk, aantal. Weektarief op aanvraag |
| `/fabrikanten` | Schrijf je robot in | Kort formulier voor fabrikanten. Toon met een knipoog: "We zoeken altijd nieuw talent" |
| `/bedankt` | Bevestiging | Na elk formulier |
| `/privacy` | Privacyverklaring | |

**De home, van boven naar beneden:**
1. Oranje hero met navigatie, de kop "Het uitzendbureau voor robots.", de intro, twee knoppen, en een rij van alle zeven robots die op een zwarte band staan, met naam en functie in die band.
2. Zwarte band met diensten: Nachtschoonmaak, Roomservice, Maaltijdronde, Linnen, Nachtronde, Ontvangst.
3. "Maak kennis met de ploeg": personeelspassen met medewerkernummer, status, personage, naam, functie, dienst, prijs en een decoratieve barcode.
4. "Waar onze robots werken": drie sectortegels die linken naar `/hotels`, `/zorg` en `/beveiliging`.
5. Werkwijze: 01 Kies je robot, 02 Kies je diensten, 03 Wij regelen de rest.
6. Oranje belofteblok: "We verkopen geen robots. We verkopen uren werk dat af is." Met drie garanties: betalen voor werk dat af is, past het niet dan wisselen we, altijd het nieuwste model.
7. Een kort blok over de flexpool, met een link naar `/flexpool`.
8. "Eerlijk over wat een robot kan": kan het al, en kan het (nog) niet.
9. Zwart pilotblok: "Tien plekken. Wie wil er eerst?" met aanmeldformulier.
10. Footer met vier kolommen en het woordmerk heel groot, met "Ben je fabrikant? Schrijf je robot in".

**FAQ op `/beveiliging`:**
- **Mag dit?** Ja, op je eigen terrein. We werken samen met een beveiligingsbedrijf met vergunning. Camera's richten we alleen op je eigen terrein.
- **Wat als er iets gebeurt?** De meldkamer kijkt live mee, spreekt via de robot, en stuurt bij een echte melding een beveiliger.
- **Wat kost uitrukken?** Dat rekent onze partner per keer af, of als vast bedrag per maand.
- **Wat als het regent?** Wout werkt in regen op verharde wegen. Rex is waterdicht. Wat de grenzen precies zijn, meten we in de pilot.
- **Wat als iemand de robot omduwt of meeneemt?** Dat ziet de meldkamer direct, en dan komt er een beveiliger.
- **Hoe lang gaat de accu mee?** Wout rijdt rondes in blokken en staat tijdens het laden op zijn station als vaste camerapost. Rex gaat 4 tot 6 uur mee en werkt in ploeg met Wout.

## 5. Configurator `/inhuren`

**Stap 0, de sector.** Kies hotel, zorglocatie, of terrein en beveiliging. `?sector=` zet hem vooraf. Elke sector toont alleen zijn eigen robots, met de standaardploeg uit `robots.json`. Pilotrobots (Fenna, Rex) staan eronder met "Meedoen aan de pilot", maar tellen niet mee in de prijs.

**Stap 1, kiezen.** Per robot:
- **Per nacht (Bram):** aantal robots van 0 tot 5, en nachten per week, 7 of 5.
- **Per maand (Mila, Joop):** aantal van 0 tot 5.
- **Per dienstuur (Wout):** aantal van 0 tot 5, uren per nacht, 8 of 12, en nachten per week, 7 of 5.

**Berekening.** Alle getallen komen uit `robots.json`:

```
per_maand(robot) =
  pricing "nacht":     aantal × nachten_per_week × weeksPerMonth × price
  pricing "dienstuur": aantal × uren_per_nacht × nachten_per_week × weeksPerMonth × price
  pricing "maand":     aantal × price

vermeden_per_maand(robot) = zelfde formule, met avoidedPerUnit in plaats van price

totaal_maand         = Σ per_maand
totaal_vermeden_maand = Σ vermeden_per_maand
```

Toon het totaal per maand groot, met daaronder een regel per robot. Toon apart: "Inhuur die je naar schatting niet meer nodig hebt: €X per maand", met de tekst uit `avoidedNote` eronder. Bij beveiliging komt er een regel bij: "Plus uitrukken bij een melding, per keer via onze beveiligingspartner." Bedragen in euro's, afgerond, met een punt als duizendtalscheiding.

**Stap 2, gegevens.** Naam, organisatie en plaats, kamers, bedden of m², "Welk werk blijft nu liggen?", e-mail en telefoon. Rechts de gekozen ploeg.

**Stap 3, bevestiging.** "Bedankt. Je ploeg staat klaar om kennis te maken. We bellen je binnen twee werkdagen."

## 6. Formulieren en opslag

Formulieren: pilotaanmelding, aanvraag uit de configurator, pilot of wachtlijst per robot, flexpool, en fabrikanten.

- Eén API-route met validatie en een honeypot tegen spam.
- Opslag via een vervangbare adapter. Begin met **Airtable**, met de sleutels als omgevingsvariabelen. Lokaal schrijft de adapter naar de console.
- Een e-mailmelding per aanvraag, bijvoorbeeld via Resend.
- Sla per aanvraag op: formulier, sector, alle velden, de gekozen ploeg met aantallen en diensten, het berekende maandbedrag, de prijsvariant (§7), UTM-bron, medium en campagne, de landingspagina en het tijdstip.

## 7. Prijstest

Wijs elke bezoeker willekeurig variant A of B toe, en onthoud die in een cookie van eerste partij:

- **A:** prijzen uit `robots.json`
- **B:** dezelfde prijzen plus 20%, afgerond op hele euro's, of op €0,50 bij het uurtarief

De variant geldt overal waar een prijs staat, en gaat mee in elke aanvraag en elk event. Met `?pv=a` of `?pv=b` forceer je een variant om te testen.

## 8. Meten

Plausible, of een andere analyticsdienst zonder cookies, zodat er geen cookiebanner nodig is. De variant-cookie is functioneel.

Events: `robot_profile_view` (slug), `sector_page_view` (sector), `filter_used` (sector), `configurator_start` (sector), `crew_changed`, `request_submitted` (sector, robots, maandbedrag, variant), `pilot_signup` (slug), `waitlist_signup` (slug), `flexpool_request`, `manufacturer_signup`.

**Wat de test moet laten zien.** Minstens 20 serieuze aanvragen in vier weken, waarvan minstens 5 zorglocaties en 5 terreinen voor beveiliging. Bouw daarom een eenvoudig overzicht in Airtable: aanvragen per sector, per prijsvariant en per landingspagina.

## 9. Techniek en kwaliteit

- Next.js met App Router en TypeScript, Tailwind met de tokens uit §2, gehost op Vercel. Statisch waar dat kan.
- Nederlands in v1. Zet de structuur klaar voor Engels (`/en`), met alle teksten in één berichtenbestand per taal.
- Laadtijd onder twee seconden op mobiel, Lighthouse 90+ op alle vier de onderdelen.
- Toegankelijk volgens WCAG AA: echte knoppen en links, labels bij elk veld, contrast 4,5:1, alles met het toetsenbord te bedienen, SVG's met `aria-label`.
- Werkt vanaf 360px breed. De robotrij in de hero wordt op mobiel een horizontaal scrollende rij.
- Meta-tags en een Open Graph-afbeelding per pagina, de sectorpagina's elk met hun eigen robots.

## 10. Inhoudelijke regels

- **Geen verzonnen bewijs:** geen reviews, klantlogo's, "bekend van", aantallen klanten of resultaten.
- **Geen beloftes over wat niet bewezen is.** Elke robot toont wat hij niet kan. Rex en Fenna zijn pilot, Rik is in opleiding.
- **Geen merknamen van fabrikanten** en geen namen van concurrenten.
- **De beveiligingspartner** wordt genoemd als "ons beveiligingsbedrijf met vergunning", tot de naam bekend is.
- Overal staat dat het om pilots in 2027 gaat.
- Gebruik op de site alleen cijfers uit dit document en `robots.json`.

## 11. Klaar als

- [ ] Alle routes uit §4 werken, de zeven profielen worden gemaakt uit `robots.json`
- [ ] De stijl van de home staat op elke pagina
- [ ] De configurator rekent precies volgens §5, met unit tests voor alle drie de prijsmodellen
- [ ] Alle formulieren slaan op, sturen een e-mail en eindigen op `/bedankt`
- [ ] De prijsvariant wordt toegewezen, onthouden, getoond en opgeslagen
- [ ] Alle events uit §8 komen binnen
- [ ] Werkt goed van 360px tot 1920px breed
- [ ] Lighthouse 90+ en WCAG AA
- [ ] Een README met lokaal draaien, de omgevingsvariabelen en het deployen

## Open punten, niet blokkerend

- robotempo.com registreren, en de merkcheck in de Benelux en de EU
- E-mailadres voor meldingen en het Airtable-account
- Naam van de beveiligingspartner
- Foto en video van Rex
- Of het groeidoel op de site komt, bijvoorbeeld "Ons doel: 100.000 robots aan het werk in Europa in 2035"
