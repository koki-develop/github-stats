import { NextPage } from "next";
import { Language } from "../../../models/language";
import RepositoriesLineChart from "../HomePage/RepositoriesLineChart";
import { useMemo } from "react";
import LanguagesLineChart from "../HomePage/LanguagesLineChart";
import PieChart from "../../utils/PieChart";

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

  const languagesPieData = useMemo(() => {
    const todayLanguages = languages[0].languages;
    return todayLanguages.map((language) => ({
      name: language.name,
      value: language.count,
      color: language.color,
    }));
  }, []);

  return (
    <div>
      <div>
        <RepositoriesLineChart data={repos} />
      </div>

      <div>
        <LanguagesLineChart data={languages} />
      </div>

      <div>
        <PieChart total={repos[0].count} data={languagesPieData} />
      </div>
    </div>
  );
};

export default RepositoriesPage;
