import fs from "fs";
import path from "path";
import { fetchLanguages } from "../lib/github";

(async () => {
  const output = path.join(process.cwd(), "data", "languages.json");

  const languages = await fetchLanguages();
  fs.writeFileSync(output, JSON.stringify(languages));
})();
