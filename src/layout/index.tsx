import Header from "@/components/compound/Header";
import Container from "@/components/primitive/Container";
import { ReactNode } from "react";

interface ILayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  return (
    <Container className="grid grid-cols-12">
      <header className="col-span-3"><Header/></header>
      <main className="mt-[76px] overflow-x-hidden col-span-9 h-screen">{children}</main>
      {/* <Footer /> */}
    </Container>
  );
};

export default Layout;
