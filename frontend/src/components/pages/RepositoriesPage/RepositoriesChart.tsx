import { format } from "date-fns";
import React, { memo, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export type RepositoriesChartProps = {
  data: {
    date: string;
    count: number;
  }[];
};

const RepositoriesChart: React.FC<RepositoriesChartProps> = memo((props) => {
  const { data } = props;

  const formattedData = useMemo(() => {
    const ascData = data
      .concat()
      .reverse()
      .map((row) => ({
        date: format(new Date(row.date), "yyyy-MM-dd"),
        count: row.count,
      }));
    const lastData = ascData.slice(-2);
    if (lastData[0].date === lastData[1].date) {
      ascData.splice(-2, 1);
    }
    return ascData;
  }, [data]);

  const xAxisCategories: string[] = useMemo(() => {
    return formattedData.map((row) => row.date);
  }, [formattedData]);

  const seriesData: number[] = useMemo(() => {
    return formattedData.map((row) => row.count);
  }, [formattedData]);

  const options = useMemo(() => {
    const options: Highcharts.Options = {
      title: { text: null },
      yAxis: { title: { text: null } },
      xAxis: { categories: xAxisCategories },
      series: [{ type: "line", name: "Public Repositories", data: seriesData }],
    };
    return options;
  }, [xAxisCategories, seriesData]);

  return <HighchartsReact highcharts={Highcharts} options={options} />;
});

RepositoriesChart.displayName = "RepositoriesChart";

export default RepositoriesChart;
