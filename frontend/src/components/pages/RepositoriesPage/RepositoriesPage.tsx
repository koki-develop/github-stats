import { NextPage } from "next";
import Highcharts, { SeriesLineOptions } from "highcharts";
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
      series: [{ type: "line", name: "Public Repositories", data: series }],
    };
    return options;
  }, []);

  const languagesOptions = useMemo(() => {
    const reversed = languages.concat().reverse();

    const categories = reversed.map((row) =>
      format(new Date(row.date), "yyyy-MM-dd")
    );

    const m = new Map<string, number[]>([]);
    for (const row of languages) {
      for (const language of row.languages) {
        const data = m.get(language.name);
        if (data) {
          m.set(language.name, [...data, language.count]);
        } else {
          m.set(language.name, [language.count]);
        }
      }
    }
    const series: SeriesLineOptions[] = Array.from(m.entries()).map(
      ([name, data]) => {
        return {
          type: "line",
          name,
          data,
        };
      }
    );

    const options: Highcharts.Options = {
      title: { text: null },
      yAxis: { title: { text: null } },
      xAxis: { categories },
      series: series,
    };
    return options;
  }, []);

  return (
    <div>
      <div>
        <HighchartsReact highcharts={Highcharts} options={reposOptions} />
      </div>

      <div>
        <HighchartsReact highcharts={Highcharts} options={languagesOptions} />
      </div>
    </div>
  );
};

export default RepositoriesPage;
