// Statische demo voor GitHub Pages. De API-route kan niet mee in een export,
// dus die gaat even opzij. Met NEXT_PUBLIC_WEB3FORMS_KEY gaan formulieren als e-mail naar de inbox,
// zonder sleutel draaien ze in demomodus.
import { execSync } from "node:child_process";
import { existsSync, renameSync, writeFileSync } from "node:fs";

const api = "src/app/api";
const parked = "scripts/.api-parked";

if (existsSync(api)) renameSync(api, parked);
try {
  execSync("next build", {
    stdio: "inherit",
    env: { ...process.env, PAGES_EXPORT: "1", NEXT_PUBLIC_DEMO: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ? "" : "1" },
  });
  writeFileSync("out/.nojekyll", "");
} finally {
  if (existsSync(parked)) renameSync(parked, api);
}
