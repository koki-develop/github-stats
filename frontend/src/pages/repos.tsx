import { GetStaticProps } from "next";
import RepositoriesPage, {
  RepositoriesPageProps,
} from "../components/pages/RepositoriesPage";
import data from "../data.json";
import { Language } from "../models/language";

export default RepositoriesPage;

export const getStaticProps: GetStaticProps<
  RepositoriesPageProps
> = async () => {
  const repos = data.map((row) => row.repos);

  const todayLanguageNames = (
    data[0].languages.languages.slice(0, 50) as Language[]
  ).map((language) => language.name);

  const languages = data.map((row) => {
    return {
      date: row.languages.date,
      languages: row.languages.languages.filter((language) =>
        todayLanguageNames.includes(language.name)
      ) as Language[],
    };
  });

  return {
    props: {
      repos,
      languages,
    },
  };
};
