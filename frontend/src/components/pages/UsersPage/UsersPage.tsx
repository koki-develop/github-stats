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
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default UsersPage;
