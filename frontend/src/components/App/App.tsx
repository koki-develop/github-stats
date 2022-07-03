import React, { useEffect, useRef } from "react";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const rendered = useRef<boolean>(false);
  const { pathname } = useRouter();

  useEffect(() => {
    if (!rendered.current) {
      rendered.current = true;
      return;
    }
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: pathname,
      debug_mode: process.env.NEXT_PUBLIC_STAGE !== "production",
    });
  }, [pathname]);

  return <Component {...pageProps} />;
};

export default App;
