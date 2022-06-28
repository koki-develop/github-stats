import { NextPage } from "next";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Language } from "../../../models/language";
import { useMemo } from "react";
import { format } from "date-fns";

export type RepositoriesPageProps = {
  repos: {
    date: string;
    count: number;
  }[];
  languages: {
    date: string;
    languages: Language[];
  }[];
};

const RepositoriesPage: NextPage<RepositoriesPageProps> = (props) => {
  const { repos, languages } = props;

  const reposOptions = useMemo(() => {
    const reversed = repos.concat().reverse();

    const seriesCategories = reversed.map((row) =>
      format(new Date(row.date), "yyyy-MM-dd")
    );

    const series = reversed.map((row) => row.count);

    const options: Highcharts.Options = {
      title: {
        text: null,
      },
      yAxis: {
        title: {
          text: null,
        },
      },
      xAxis: {
        categories: seriesCategories,
      },
      series: [
        { type: "line", name: "Public Repositories", data: series, yAxis: 0 },
      ],
    };
    return options;
  }, []);
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={reposOptions} />
    </div>
  );
};

export default RepositoriesPage;
