import { cn } from "@/utils/helpers";
import { ReactNode } from "react";

interface IContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className }: IContainerProps) => {
  return (
    <div className={cn("px-15px w-full mx-auto max-w-[1280px]", className)}>
      {children}
    </div>
  );
};

export default Container;
