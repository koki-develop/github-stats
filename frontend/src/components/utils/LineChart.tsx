import Highcharts, { SeriesOptionsType } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useMemo } from "react";

export type LineChartProps = {
  height?: number;
  points: Point[];
  legend?: boolean;
};

type Point = {
  date: string;
  data: { name: string; color?: string; value: number }[];
};

const LineChart: React.FC<LineChartProps> = props => {
  const { height = 400, points, legend } = props;

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
        if (!point.data.find(row => row.name === name)) {
          point.data.push({ name, value: null });
        }
      }
    }

    const formattedPoints = pointsClone
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .map(point => ({
        date: new Date(point.date).toISOString().split("T")[0],
        data: point.data,
      }));
    return formattedPoints;
  }, [points]);

  const dates = useMemo(() => {
    return formattedPoints.map(point => point.date);
  }, [formattedPoints]);

  const series: SeriesOptionsType[] = useMemo(() => {
    const m = new Map<string, [string, number[]]>([]);
    for (const point of formattedPoints) {
      for (const row of point.data) {
        const color_values = m.get(row.name);
        if (color_values) {
          const [color = "#000000", values] = color_values;
          m.set(row.name, [color, [...values, row.value]]);
        } else {
          m.set(row.name, [row.color ?? "#000000", [row.value]]);
        }
      }
    }
    return Array.from(m.entries()).map(([name, [color, values]], i) => {
      return { type: "line", visible: i <= 12, name, color, data: values };
    });
  }, []);

  const options = useMemo(() => {
    const options: Highcharts.Options = {
      chart: {
        height,
      },
      tooltip: {
        pointFormatter() {
          return `<span style="color:${this.color}">●</span> ${
            this.series.name
          }: <b>${this.y.toLocaleString()}</b>`;
        },
      },
      title: { text: null },
      yAxis: { title: { text: null } },
      xAxis: { categories: dates },
      legend: {
        enabled: legend,
      },
      series,
    };
    return options;
  }, []);

  return (
    <div style={{ height }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default LineChart;
