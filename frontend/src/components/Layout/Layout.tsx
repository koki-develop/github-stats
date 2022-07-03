import Link from "next/link";
import React, { memo } from "react";

export type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = memo((props) => {
  const { children } = props;

  return (
    <div>
      <header className="bg-black px-4 py-2 text-white">
        <h1 className="text-4xl font-bold">
          <Link href="/">GitHub Stats</Link>
        </h1>
      </header>

      <main className="py-4 px-2">{children}</main>

      <footer className="flex flex-col items-center justify-center py-12">
        <small className="mb-4">&copy;2022 koki sato</small>

        <ul className="flex flex-col items-center">
          <li className="mb-2">
            <a
              href="https://github.com/koki-develop/github-stats"
              target="_blank"
              rel="noreferrer noopener"
            >
              View on GitHub
            </a>
          </li>
          <li className="mb-2">
            <Link href="/privacy">Privacy Policy</Link>
          </li>
        </ul>
      </footer>
    </div>
  );
});

Layout.displayName = "Layout";

export default Layout;
