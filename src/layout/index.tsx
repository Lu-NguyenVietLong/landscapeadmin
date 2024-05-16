"use client";
import Header from "@/components/compound/Header";
import Container from "@/components/primitive/Container";
import Login from "@/containers/Login";
import useAuth from "@/packages/hook/useAuth";
import { ReactNode } from "react";

interface ILayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
    // return <pre>{JSON.stringify(user, null, 4)}</pre>;
  }
  return (
    <Container className="grid grid-cols-12">
      <header className="col-span-3">
        <Header />
      </header>
      <main className="mt-[76px] overflow-x-hidden col-span-9 h-screen">
        {children}
      </main>
      {/* <Footer /> */}
    </Container>
  );
};

export default Layout;
