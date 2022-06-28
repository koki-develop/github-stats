import { NextPage } from "next";
import React from "react";

export type UsersPageProps = {
  data: {
    date: string;
    count: number;
  }[];
};

const UsersPage: NextPage<UsersPageProps> = (props) => {
  const { data } = props;
  return <div>{JSON.stringify(data)}</div>;
};

export default UsersPage;
