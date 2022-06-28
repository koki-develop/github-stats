import { GetStaticProps } from "next";
import UsersPage, { UsersPageProps } from "../components/pages/UsersPage";
import data from "../data.json";

export default UsersPage;

export const getStaticProps: GetStaticProps<UsersPageProps> = async () => {
  const users = data.map((row) => row.users);
  return {
    props: {
      data: users,
    },
  };
};
