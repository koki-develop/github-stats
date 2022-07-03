import React, { memo } from "react";

export type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = memo((props) => {
  const { children } = props;

  return (
    <div>
      <div>{children}</div>
    </div>
  );
});

Layout.displayName = "Layout";

export default Layout;
