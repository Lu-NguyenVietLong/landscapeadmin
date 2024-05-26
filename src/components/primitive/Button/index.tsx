import { cva } from "class-variance-authority";
import Link from "next/link";
import React, { ReactNode } from "react";
import { cn } from "@/utils/helpers";

export const buttonStyles = cva(
  "flex-center gap-2 rounded-lg h-max w-max transition-all duration-300 whitespace-nowrap border",
  {
    variants: {
      type: {
        primary: "bg-primary-light hover:bg-primary hover:text-white",
        secondary: "bg-white hover:bg-foreground hover:text-white",
      },
      size: {
        normal: "py-2 px-3",
      },
    },
  }
);

export interface IButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  size?: "normal";
  [key: string]: any;
}

const Button = ({
  children,
  className,
  href,
  variant = "primary",
  type = "button",
  size = "normal",
  ...props
}: IButtonProps) => {
  if (href) {
    return (
      <Link
        href={href}
        className={cn(buttonStyles({ type: variant, size, className }))}
        {...props}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      className={cn(buttonStyles({ type: variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
