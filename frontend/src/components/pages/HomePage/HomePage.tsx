import classNames from "classnames";
import { NextPage } from "next";
import Head from "next/head";
import React, { useMemo } from "react";
import Layout from "../../Layout";
import LineChart from "../../utils/LineChart";
import Number from "../../utils/Number";
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

const HomePage: NextPage<HomePageProps> = props => {
  const { repos, languages, users, orgs } = props;

  const usersData = useMemo(() => {
    return users.data.map(record => ({
      date: record.date,
      data: [
        {
          name: "Users",
          color: "#00cc00",
          value: record.count,
        },
      ],
    }));
  }, [users.data]);

  const orgsData = useMemo(() => {
    return orgs.data.map(record => ({
      date: record.date,
      data: [
        {
          name: "Organizations",
          color: "#000000",
          value: record.count,
        },
      ],
    }));
  }, [orgs.data]);

  return (
    <Layout>
      <Head>
        <title>GitHub Stats</title>
      </Head>

      <div className="mb-4 px-2">
        <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          For various reasons, we are not updating the data at this time.
        </div>
      </div>

      {/* Public Repositories */}
      <div className="mb-4">
        <div className="mb-2 px-2">
          <div className="text-xl font-bold">Public Repositories</div>
          <div className="text-sm">
            <Number value={repos.latest.count} /> (
            <Number diff value={repos.latest.diff} />)
          </div>
        </div>
        <div className="mb-2">
          <RepositoriesLineChart repos={repos.data} />
        </div>
      </div>

      {/* Public Repositories By Language */}
      <div className="mb-4">
        <div className="mb-2 px-2">
          <div className="text-xl font-bold">
            Public Repositories ( By Language )
          </div>
          <div className="text-sm">
            The languages included here are only those{" "}
            <a
              className="text-blue-500 underline"
              href="https://github.com/github/linguist/blob/master/lib/linguist/languages.yml"
              target="_blank"
              rel="noreferrer noopener"
            >
              supported by GitHub
            </a>{" "}
            whose type is{" "}
            <code className="rounded bg-gray-100 px-1">programming</code> or{" "}
            <code className="rounded bg-gray-100 px-1">markup</code>.
          </div>
        </div>
        <div className="mb-2">
          <LanguagesLineChart data={languages.data} />
        </div>

        <div className="mb-2 px-2 md:flex md:items-center">
          <div className="mb-2 md:mb-0 md:w-1/2">
            <PieChart
              total={repos.latest.count}
              data={languages.latest.topLanguages.map(language => ({
                name: language.name,
                color: language.color,
                value: language.count,
              }))}
            />
          </div>
          <div className="mb-2 flex h-96 overflow-y-auto border md:w-1/2">
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
                  <tr
                    key={language.name}
                    className={classNames({
                      "bg-gray-50": i % 2 === 0,
                    })}
                  >
                    <td className="border px-4 text-center">{i + 1}</td>
                    <td className="border px-4 text-center">{language.name}</td>
                    <td className="border px-4 py-1 text-center">
                      <div>
                        <Number value={language.count} />
                      </div>
                      <div className="text-xs">
                        (<Number diff value={language.diff} />)
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Users */}
      <div className="mb-4">
        <div className="mb-2 px-2">
          <div className="text-xl font-bold">Users</div>
          <div className="text-sm">
            <Number value={users.latest.count} /> (
            <Number diff value={users.latest.diff} />)
          </div>
        </div>
        <div className="mb-2">
          <LineChart points={usersData} />
        </div>
      </div>

      {/* Organizations */}
      <div className="mb-4">
        <div className="mb-2 px-2">
          <div className="text-xl font-bold">Organizations</div>
          <div className="text-sm">
            <Number value={orgs.latest.count} /> (
            <Number diff value={orgs.latest.diff} />)
          </div>
        </div>
        <div className="mb-2">
          <LineChart points={orgsData} />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
