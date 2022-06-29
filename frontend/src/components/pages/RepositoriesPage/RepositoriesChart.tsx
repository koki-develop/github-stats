import React, { memo, useMemo } from "react";
import LineChart from "../../utils/LineChart";

export type RepositoriesChartProps = {
  data: {
    date: string;
    count: number;
  }[];
};

const RepositoriesChart: React.FC<RepositoriesChartProps> = memo((props) => {
  const { data } = props;

  const points = useMemo(() => {
    return data.map((row) => ({
      date: row.date,
      data: [{ name: "Public Repositories", value: row.count }],
    }));
  }, [data]);

  return <LineChart points={points} />;
});

RepositoriesChart.displayName = "RepositoriesChart";

export default RepositoriesChart;
