import fs from "fs";
import path from "path";
import { fetchLanguagesWithoutCount } from "../lib/github";

(async () => {
  const output = path.join(process.cwd(), "data", "languages_without_count.json");

  const languages = await fetchLanguagesWithoutCount();
  fs.writeFileSync(output, JSON.stringify(languages));
})();
