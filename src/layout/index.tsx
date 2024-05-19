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
        <Header />
        <Container className="grid grid-cols-12">
          <div className="col-span-2">
            <SideBar />
          </div>
          <main className="bg-slate-50 p-3 border-slate-200 border rounded-t-2xl col-span-10 overflow-x-hidden h-screen">
            {children}
          </main>
        </Container>
        {/* <Footer /> */}
      </>
    );
  }
  return <Login />;
};

export default Layout;
