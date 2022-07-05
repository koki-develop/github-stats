import React, { memo, useMemo } from "react";
import LineChart from "../../utils/LineChart";

export type RepositoriesLineChartProps = {
  repos: {
    date: string;
    count: number;
  }[];
};

const RepositoriesLineChart: React.FC<RepositoriesLineChartProps> = memo(
  props => {
    const { repos } = props;

    const points = useMemo(() => {
      return repos.map(row => ({
        date: row.date,
        data: [
          { name: "Public Repositories", color: "#7cb5ec", value: row.count },
        ],
      }));
    }, [repos]);

    return <LineChart points={points} />;
  },
);

RepositoriesLineChart.displayName = "RepositoriesLineChart";

export default RepositoriesLineChart;
