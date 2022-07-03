import { NextPage } from "next";
import RepositoriesLineChart from "../RepositoriesPage/RepositoriesLineChart";

export type HomePageProps = {
  repos: {
    latest: {
      date: string;
      count: number;
    };
    diff: number;
    data: { date: string; count: number }[];
  };
};

const HomePage: NextPage<HomePageProps> = (props) => {
  const { repos } = props;

  return (
    <div>
      <div>
        <div>
          Public Repository {repos.latest.count} ({repos.diff})
        </div>
        <div>updated: {repos.latest.date}</div>
        <div>
          <RepositoriesLineChart repos={repos.data} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
