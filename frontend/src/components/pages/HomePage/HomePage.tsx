import { NextPage } from "next";
import RepositoriesLineChart from "../RepositoriesPage/RepositoriesLineChart";

export type HomePageProps = {
  repos: {
    latest: {
      date: string;
      count: number;
      diff: number;
    };
    data: { date: string; count: number }[];
  };

  languages: {
    latest: {
      date: string;
      topLanguages: {
        name: string;
        color: string;
        count: number;
        diff: number;
      }[];
    };
  };
};

const HomePage: NextPage<HomePageProps> = (props) => {
  const { repos, languages } = props;

  return (
    <div>
      <div>
        <div>
          Public Repository {repos.latest.count} ({repos.latest.diff})
        </div>
        <div>updated: {repos.latest.date}</div>
        <div>
          <RepositoriesLineChart repos={repos.data} />
        </div>
        <div>
          <div>Languages</div>
          <div>updated: {languages.latest.date}</div>
          <div>
            {languages.latest.topLanguages.map((language) => (
              <div key={language.name}>
                {language.name}: {language.count} ({language.diff})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
