import { GetStaticProps } from "next";
import HomePage, { HomePageProps } from "../components/pages/HomePage";
import data from "../data.json";

export default HomePage;

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const reposData = data.map((record) => record.repos);
  const reposSortedData = reposData
    .concat()
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const [reposTodayData, reposYesterdayData] = reposSortedData;
  const reposDiff = reposTodayData.count - reposYesterdayData.count;

  return {
    props: {
      repos: {
        latest: reposTodayData,
        diff: reposDiff,
        data: reposSortedData,
      },
    },
  };
};
