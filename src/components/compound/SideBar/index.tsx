"use client";
import { MENU } from "@/utils/routes";
import { map } from "lodash";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/helpers";

const SideBar = () => {
  const pathname = usePathname();
  return (
    <aside className="shadow-default px-3">
      <Link href="/" className="block mt-4 py-4">
        <div className="text-black font-bold text-xl">Sắc Xanh Garden</div>
      </Link>
      <ul className="mt-5">
        {map(MENU, (item, index) => (
          <li key={index}>
            <Link
              className={cn(
                "py-3 block font-semibold text-primary-second px-2 rounded-lg",
                {
                  "text-primary bg-primary/20": pathname === item.route,
                }
              )}
              href={item.route}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
