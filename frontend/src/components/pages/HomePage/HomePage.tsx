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
          <div className="text-xl">{repos.latest.count}</div>
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
        <div className="flex">
          <div className="w-1/2">
            <PieChart
              total={repos.latest.count}
              data={languages.latest.topLanguages.map((language) => ({
                name: language.name,
                color: language.color,
                value: language.count,
              }))}
            />
          </div>
          <div className="flex h-96 w-1/2 overflow-y-auto border">
            <table className="w-full">
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
                    <td className="border border-l-0 px-4 text-center">
                      {i + 1}
                    </td>
                    <td className="border px-4 text-center">{language.name}</td>
                    <td className="border border-r-0 px-4 py-1 text-center">
                      <div>{language.count}</div>
                      <div className="text-xs">({language.diff})</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between">
          <div className="text-lg">Users</div>
          <div className="text-xl">{users.latest.count}</div>
        </div>
        <div>
          <LineChart points={usersData} />
        </div>
      </div>

      <div>
        <div className="flex justify-between">
          <div className="text-lg">Organizations</div>
          <div className="text-xl">{orgs.latest.count}</div>
        </div>
        <div>
          <LineChart points={orgsData} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
