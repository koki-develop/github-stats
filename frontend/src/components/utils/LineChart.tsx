import { format } from "date-fns";
import React, { useMemo } from "react";
import Highcharts, { SeriesOptionsType } from "highcharts";
import HighchartsReact from "highcharts-react-official";

export type LineChartProps = {
  points: Point[];
};

type Point = {
  date: string;
  data: { name: string; value: number }[];
};

const LineChart: React.FC<LineChartProps> = (props) => {
  const { points } = props;

  const formattedPoints = useMemo(() => {
    const pointsClone = points.concat();

    const allDataName: string[] = [];
    for (const point of pointsClone) {
      for (const row of point.data) {
        if (!allDataName.includes(row.name)) {
          allDataName.push(row.name);
        }
      }
    }
    for (const point of pointsClone) {
      for (const name of allDataName) {
        if (!point.data.find((row) => row.name === name)) {
          point.data.push({ name, value: null });
        }
      }
    }

    const formattedPoints = pointsClone
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .map((point) => ({
        date: format(new Date(point.date), "yyyy-MM-dd"),
        data: point.data,
      }));
    const [semiLast, last] = formattedPoints.slice(-2);
    if (semiLast.date === last.date) {
      formattedPoints.splice(-2, 1);
    }
    return formattedPoints;
  }, [points]);

  const dates = useMemo(() => {
    return formattedPoints.map((point) => point.date);
  }, [formattedPoints]);

  const series: SeriesOptionsType[] = useMemo(() => {
    const m = new Map<string, number[]>([]);
    for (const point of formattedPoints) {
      for (const row of point.data) {
        const values = m.get(row.name);
        if (values) {
          m.set(row.name, [...values, row.value]);
        } else {
          m.set(row.name, [row.value]);
        }
      }
    }
    return Array.from(m.entries()).map(([name, values]) => {
      return { type: "line", name, data: values };
    });
  }, []);

  const options = useMemo(() => {
    const options: Highcharts.Options = {
      title: { text: null },
      yAxis: { title: { text: null } },
      xAxis: { categories: dates },
      series,
    };
    return options;
  }, []);

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default LineChart;