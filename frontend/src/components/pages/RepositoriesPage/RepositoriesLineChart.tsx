import React, { memo, useMemo } from "react";
import LineChart from "../../utils/LineChart";

export type RepositoriesLineChartProps = {
  data: {
    date: string;
    count: number;
  }[];
};

const RepositoriesLineChart: React.FC<RepositoriesLineChartProps> = memo(
  (props) => {
    const { data } = props;

    const points = useMemo(() => {
      return data.map((row) => ({
        date: row.date,
        data: [{ name: "Public Repositories", value: row.count }],
      }));
    }, [data]);

    return <LineChart points={points} />;
  }
);

RepositoriesLineChart.displayName = "RepositoriesLineChart";

export default RepositoriesLineChart;
