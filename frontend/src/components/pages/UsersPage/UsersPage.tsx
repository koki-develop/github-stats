import { NextPage } from "next";
import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { format } from "date-fns";

export type UsersPageProps = {
  users: {
    date: string;
    count: number;
  }[];
  orgs: {
    date: string;
    count: number;
  }[];
};

const UsersPage: NextPage<UsersPageProps> = (props) => {
  const { users, orgs } = props;

  const [todayUsers, yesterdayUsers] = users;
  const [todayOrgs, yesterdayOrgs] = orgs;

  const options = useMemo(() => {
    const reversedUsers = users.concat().reverse();
    const reversedOrgs = orgs.concat().reverse();

    const seriesCategories = reversedUsers.map((row) =>
      format(new Date(row.date), "yyyy-MM-dd")
    );

    const usersSeries = reversedUsers.map((row) => row.count);
    const orgsSeries = reversedOrgs.map((row) => row.count);

    const options: Highcharts.Options = {
      title: {
        text: null,
      },
      yAxis: [
        {
          title: {
            text: "Users",
          },
        },
        {
          opposite: true,
          title: {
            text: "Organizations",
          },
        },
      ],
      xAxis: {
        categories: seriesCategories,
      },
      series: [
        { type: "line", name: "Users", data: usersSeries, yAxis: 0 },
        { type: "line", name: "Organizations", data: orgsSeries, yAxis: 1 },
      ],
    };
    return options;
  }, []);

  return (
    <div>
      <div>
        <h1>Users</h1>
        <p>
          {todayUsers.count} ({todayUsers.count - yesterdayUsers.count})
        </p>
      </div>
      <div>
        <h1>Organizations</h1>
        <p>
          {todayOrgs.count} ({todayOrgs.count - yesterdayOrgs.count})
        </p>
      </div>
      <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default UsersPage;
