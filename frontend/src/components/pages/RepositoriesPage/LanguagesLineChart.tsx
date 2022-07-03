import React, { useMemo } from "react";
import { Language } from "../../../models/language";
import LineChart from "../../utils/LineChart";

export type LanguagesLineChartProps = {
  data: {
    date: string;
    languages: { name: string; color: string; count: number }[];
  }[];
};

const LanguagesLineChart: React.FC<LanguagesLineChartProps> = (props) => {
  const { data } = props;

  const points = useMemo(() => {
    return data.map((row) => ({
      date: row.date,
      data: row.languages.map((language) => ({
        name: language.name,
        color: language.color,
        value: language.count,
      })),
    }));
  }, [data]);

  return <LineChart points={points} legend />;
};

export default LanguagesLineChart;
