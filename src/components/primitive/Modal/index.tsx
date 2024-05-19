"use client";

import { cn } from "@/utils/helpers";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import React from "react";

export const buttonStyles = cva(
  "fixed top-0 right-0 left-0 bottom-0 m-auto bg-white overflow-y-auto",
  {
    variants: {
      type: {
        primary: "bg-primary-light hover:bg-primary hover:text-white",
        secondary: "bg-white hover:bg-foreground hover:text-white",
      },
      size: {
        small: "w-[70%]",
        medium: "w-[80%]",
        large: "w-[90%]",
      },
    },
  }
);

interface IModal {
  isOpen?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  size = "medium",
  className,
  children,
}: IModal) => {
  return (
    <div
      className={cn(
        "fixed top-0 right-0 left-0 bottom-0 z-40 bg-black/50 overflow-hidden",
        {
          hidden: !isOpen,
          block: isOpen,
        }
      )}
    >
      <div className={cn(buttonStyles({ size, className }))}>
        <div
          onClick={onClose}
          className="absolute top-3 right-3 hover:cursor-pointer hover:text-primary"
        >
          <X />
        </div>
        <div className="py-5 px-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
