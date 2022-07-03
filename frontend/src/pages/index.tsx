import { GetStaticProps } from "next";
import HomePage, { HomePageProps } from "../components/pages/HomePage";
import data from "../data.json";

export default HomePage;

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  // repositories
  const reposData = data.map((record) => record.repos);
  const reposSortedData = reposData
    .concat()
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const [reposTodayData, reposYesterdayData] = reposSortedData;
  const reposDiff = reposTodayData.count - reposYesterdayData.count;

  // languages
  const languagesData = data.map((record) => record.languages);
  const languagesSortedData = languagesData
    .concat()
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const [languagesTodayData, languagesYesterdayData] = languagesSortedData;
  const languagesTodayTopData = languagesTodayData.languages
    .concat()
    .sort((a, b) => b.count - a.count)
    .slice(0, 50);
  const languagesFilteredData = languagesSortedData.map((data) => {
    return {
      date: data.date,
      languages: data.languages
        .filter((language) =>
          languagesTodayTopData.find(
            (topLanguage) => topLanguage.name === language.name
          )
        )
        .map((language) => ({ color: "#000000", ...language })),
    };
  });

  const props: HomePageProps = {
    repos: {
      latest: {
        ...reposTodayData,
        diff: reposDiff,
      },
      data: reposSortedData,
    },
    languages: {
      latest: {
        date: languagesTodayData.date,
        topLanguages: languagesTodayTopData.map((language) => ({
          name: language.name,
          color: language.color ?? "#000000",
          count: language.count,
          diff: (() => {
            const yesterdayLanguage = languagesYesterdayData.languages.find(
              (yesterdayLanguage) => yesterdayLanguage.name === language.name
            );
            if (!yesterdayLanguage) return language.count;
            return language.count - yesterdayLanguage.count;
          })(),
        })),
      },
      data: languagesFilteredData,
    },
  };

  return {
    props,
  };
};
