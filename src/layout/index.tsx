"use client";
import Header from "@/components/compound/Header";
import SideBar from "@/components/compound/SideBar";
import Container from "@/components/primitive/Container";
import Login from "@/containers/Login";
import useAuth from "@/packages/hook/useAuth";
import { ReactNode } from "react";

interface ILayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  const { user } = useAuth();

  if (user) {
    return (
      <>
        <div className="grid grid-cols-12">
          <div className="col-span-2">
            <SideBar />
          </div>
          <main className="bg-background px-6 col-span-10 overflow-x-hidden h-screen">
            <Header />
            {children}
          </main>
        </div>
        {/* <Footer /> */}
      </>
    );
  }
  return <Login />;
};

export default Layout;
