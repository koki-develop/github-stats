import { NextPage } from "next";
import Error from "next/error";
import React from "react";

const NotFoundPage: NextPage = () => {
  return (
    <Error
      statusCode={404}
      title="GitHub Stats | This page could not be found."
    />
  );
};

export default NotFoundPage;
