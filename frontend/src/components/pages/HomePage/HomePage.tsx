import { NextPage } from "next";
import Link from "next/link";
import { Language } from "../../../models/language";

export type HomePageProps = {
  users: {
    updatedAt: string;
    today: number;
    yesterday: number;
  };
  orgs: {
    updatedAt: string;
    today: number;
    yesterday: number;
  };
  repos: {
    updatedAt: string;
    today: number;
    yesterday: number;
  };
  topLanguages: {
    updatedAt: string;
    today: Language[];
    yesterday: Language[];
  };
};

const HomePage: NextPage<HomePageProps> = (props) => {
  const { users, orgs, repos, topLanguages } = props;

  return (
    <div>
      <div>
        <h1>
          <Link href="/users">Users</Link>
        </h1>
        <p>updated: {users.updatedAt}</p>
        <p>today: {users.today}</p>
        <p>yesterday: {users.yesterday}</p>
      </div>
      <div>
        <h1>orgs</h1>
        <p>updated: {orgs.updatedAt}</p>
        <p>today: {orgs.today}</p>
        <p>yesterday: {orgs.yesterday}</p>
      </div>
      <div>
        <h1>repos</h1>
        <p>updated: {repos.updatedAt}</p>
        <p>today: {repos.today}</p>
        <p>yesterday: {repos.yesterday}</p>
      </div>
      <div>
        <h1>top languages</h1>
        <p>updated: {topLanguages.updatedAt}</p>
        <div>
          today
          <ol>
            {topLanguages.today.map((language) => (
              <li key={language.name}>
                {language.name} ({language.type}): {language.count}
              </li>
            ))}
          </ol>
        </div>
        <div>
          yesterday
          <ol>
            {topLanguages.yesterday.map((language) => (
              <li key={language.name}>
                {language.name} ({language.type}): {language.count}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
