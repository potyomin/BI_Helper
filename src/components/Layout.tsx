import type { PropsWithChildren } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen" translate="no">
    <Sidebar />
    <div className="md:ml-64">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 md:py-6">{children}</main>
    </div>
  </div>
);

export default Layout;
