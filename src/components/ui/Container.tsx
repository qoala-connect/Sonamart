import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "full";
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "lg", ...props }, ref) => {
    const sizeClass = {
      sm: "max-w-4xl",
      md: "max-w-6xl",
      lg: "max-w-7xl",
      full: "w-full",
    }[size];

    return (
      <div
        ref={ref}
        className={cn("mx-auto px-6 md:px-8 lg:px-12", sizeClass, className)}
        {...props}
      />
    );
  },
);

Container.displayName = "Container";
