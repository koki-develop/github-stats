import { NextPage } from "next";
import LineChart from "../../utils/LineChart";
import PieChart from "../../utils/PieChart";
import LanguagesLineChart from "../RepositoriesPage/LanguagesLineChart";
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
    data: {
      date: string;
      languages: { name: string; color: string; count: number }[];
    }[];
  };

  users: {
    latest: {
      date: string;
      count: number;
      diff: number;
    };
    data: { date: string; count: number }[];
  };

  orgs: {
    latest: {
      date: string;
      count: number;
      diff: number;
    };
    data: { date: string; count: number }[];
  };
};

const HomePage: NextPage<HomePageProps> = (props) => {
  const { repos, languages, users, orgs } = props;

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
            <LanguagesLineChart data={languages.data} />
          </div>
          <div>
            <PieChart
              total={repos.latest.count}
              data={languages.latest.topLanguages.map((language) => ({
                name: language.name,
                color: language.color,
                value: language.count,
              }))}
            />
          </div>
          <div>
            {languages.latest.topLanguages.map((language) => (
              <div key={language.name}>
                {language.name}: {language.count} ({language.diff})
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div>
          Users {users.latest.count} ({users.latest.diff})
        </div>
        <div>updated: {users.latest.date}</div>
      </div>

      <div>
        <div>
          Orgs {orgs.latest.count} ({orgs.latest.diff})
        </div>
        <div>updated: {orgs.latest.date}</div>
      </div>
    </div>
  );
};

export default HomePage;
