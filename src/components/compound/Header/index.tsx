import Container from "@/components/primitive/Container";
import useAuth from "@/packages/hook/useAuth";
import { MENU } from "@/utils/routes";
import { map } from "lodash";
import { Bell, ChevronDown } from "lucide-react";
import Link from "next/link";
import React from "react";

const Header = () => {
  const { user, logout } = useAuth();
  return (
    // <section className='shadow-default size-full p-5 bg-white rounded-l-[32px]'>
    //     <Link href="/">
    //       <div className="text-primary font-bold text-xl">Landscape Admin</div>
    //     </Link>
    //     <ul className='mt-50px pl-4'>
    //       {map(MENU, (item, index) => (
    //       <li key={item.route}>
    //       <Link className='px-2 py-3 block font-semibold hover:text-primary' href={item.route}>
    //         {item.title}
    //       </Link>
    //     </li>
    //       ))}
    //     </ul>
    // </section>
    <header className="h-[56px]">
      <Container className="h-full flex items-center justify-between">
        <Link href="/" className="block">
          <div className="text-primary font-bold text-xl">Sắc Xanh Garden</div>
        </Link>
        <div className="gap-4 flex items-center">
          <div className="cursor-pointer hover:text-primary-lighter">
            <Bell />
          </div>
          <div
            onClick={() => logout()}
            className="cursor-pointer hover:text-primary-lighter"
          >
            Đăng xuất
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
