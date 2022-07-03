import Link from "next/link";
import React, { memo } from "react";

export type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = memo((props) => {
  const { children } = props;

  return (
    <div>
      <header>
        <h1 className=" text-4xl font-bold">GitHub Stats</h1>
      </header>

      <main className="py-4 px-2">{children}</main>

      <footer className="flex flex-col items-center justify-center">
        <small>&copy;2022 koki sato</small>

        <ul className="flex flex-col items-center">
          <li>
            <a
              href="https://github.com/koki-develop/github-stats"
              target="_blank"
              rel="noreferrer noopener"
            >
              View on GitHub
            </a>
          </li>
          <li>
            <Link href="/privacy">Privacy Policy</Link>
          </li>
        </ul>
      </footer>
    </div>
  );
});

Layout.displayName = "Layout";

export default Layout;
