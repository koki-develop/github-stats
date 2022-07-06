import { fetchLanguagesWithoutCount } from "../lib/github";
import { writeData, FileNames } from "./util";

(async () => {
  const languages = await fetchLanguagesWithoutCount();
  writeData(FileNames.LanguagesWithoutCount, JSON.stringify(languages));
})();
