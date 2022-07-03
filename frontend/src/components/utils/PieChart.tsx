import Highcharts, { PointOptionsObject, SeriesLineOptions } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useMemo } from "react";

export type PieChartProps = {
  total: number;
  data: {
    name: string;
    value: number;
    color?: string;
  }[];
};

const floor = (num: number) => Math.floor(num * 100) / 100;

const PieChart: React.FC<PieChartProps> = (props) => {
  const { total, data } = props;

  const formattedData = useMemo(() => {
    const formattedData = data
      .map((row) => ({
        name: row.name,
        color: row.color ?? "#000000",
        percentage: floor((row.value / total) * 100),
      }))
      .reduce((prev, current) => {
        if (current.percentage < 0.5) {
          return prev;
        }
        return [...prev, current];
      }, []);

    const totalPercentage = formattedData.reduce<number>((prev, current) => {
      return prev + current.percentage;
    }, 0);
    formattedData.push({
      name: "Other",
      color: "#888888",
      percentage: floor(100 - totalPercentage),
    });
    return formattedData;
  }, []);

  const options = useMemo(() => {
    const seriesData = formattedData.map((row) => ({
      name: row.name,
      color: row.color ?? "#000000",
      y: row.percentage,
    }));

    const options: Highcharts.Options = {
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 350,
            },
            chartOptions: {
              chart: {
                margin: 0,
                height: 300,
              },
            },
          },
        ],
      },
      title: { text: null },
      series: [{ type: "pie", name: "Public Repositories", data: seriesData }],
    };
    return options;
  }, []);

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default PieChart;
