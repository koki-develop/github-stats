import { GetStaticProps } from "next";
import { Language } from "../models/language";
import HomePage, { HomePageProps } from "../components/pages/HomePage";
import data from "../data.json";

export default HomePage;

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const [
    { users, orgs, repos, languages },
    { users: yUsers, orgs: yOrgs, repos: yRepos, languages: yLanguages },
  ] = data;

  return {
    props: {
      users: {
        updatedAt: users.date,
        today: users.count,
        yesterday: yUsers.count,
      },
      orgs: {
        updatedAt: orgs.date,
        today: orgs.count,
        yesterday: yOrgs.count,
      },
      repos: {
        updatedAt: repos.date,
        today: repos.count,
        yesterday: yRepos.count,
      },
      topLanguages: {
        updatedAt: languages.date,
        today: languages.languages.slice(0, 10) as Language[],
        yesterday: yLanguages.languages.slice(0, 10) as Language[],
      },
    },
  };
};
