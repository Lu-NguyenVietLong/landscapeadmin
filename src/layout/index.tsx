"use client";
import Header from "@/components/compound/Header";
import SideBar from "@/components/compound/SideBar";
import Container from "@/components/primitive/Container";
import Login from "@/containers/Login";
import useAuth from "@/packages/hook/useAuth";
import { cn } from "@/utils/helpers";
import { ReactNode } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface ILayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  const { user } = useAuth();
  return (
    <>
      <div className="grid grid-cols-12">
        <div className="col-span-2">{user && <SideBar />}</div>
        <main
          className={cn(
            "bg-background px-6 col-span-10 overflow-x-hidden h-screen",
            {
              "col-span-12": !user,
            }
          )}
        >
          {user && <Header />}
          {children}
        </main>
        <ToastContainer />
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
