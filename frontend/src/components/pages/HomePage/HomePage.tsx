import { NextPage } from "next";
import { useMemo } from "react";
import LineChart from "../../utils/LineChart";
import PieChart from "../../utils/PieChart";
import LanguagesLineChart from "./LanguagesLineChart";
import RepositoriesLineChart from "./RepositoriesLineChart";

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

  const usersData = useMemo(() => {
    return users.data.map((record) => ({
      date: record.date,
      data: [
        {
          name: "Users",
          color: "#7cb5ec",
          value: record.count,
        },
      ],
    }));
  }, [users.data]);

  const orgsData = useMemo(() => {
    return orgs.data.map((record) => ({
      date: record.date,
      data: [
        {
          name: "orgs",
          color: "#000000",
          value: record.count,
        },
      ],
    }));
  }, [orgs.data]);

  return (
    <div>
      <div>
        <div className="flex justify-between">
          <div className="text-lg">Public Repositories</div>
          <div className="text-xl">{repos.latest.diff}</div>
        </div>
        <div>
          <RepositoriesLineChart repos={repos.data} />
        </div>
      </div>

      <div>
        <div className="text-lg">Public Repositories ( per language )</div>
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
        <div className="flex justify-center">
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4">Ranking</th>
                <th className="px-4">Language</th>
                <th className="px-4">Count</th>
              </tr>
            </thead>
            <tbody>
              {languages.latest.topLanguages.map((language, i) => (
                <tr key={language.name}>
                  <td className="border px-4 py-2 text-center">{i + 1}</td>
                  <td className="border px-4 py-2 text-center">
                    {language.name}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <div>{language.count}</div>
                    <div className="text-xs">({language.diff})</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div>
          Users {users.latest.count} ({users.latest.diff})
        </div>
        <div>updated: {users.latest.date}</div>
        <div>
          <LineChart points={usersData} />
        </div>
      </div>

      <div>
        <div>
          Orgs {orgs.latest.count} ({orgs.latest.diff})
        </div>
        <div>updated: {orgs.latest.date}</div>
        <div>
          <LineChart points={orgsData} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
