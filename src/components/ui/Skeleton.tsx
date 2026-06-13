import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "animate-pulse bg-gradient-to-r from-stone-dark/10 via-stone-dark/5 to-stone-dark/10 rounded-lg",
        className,
      )}
      {...props}
    />
  ),
);

Skeleton.displayName = "Skeleton";

export const SkeletonText = () => (
  <div className="space-y-3">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-4 w-4/5" />
  </div>
);

export const SkeletonCard = () => (
  <div className="card-luxury p-6 space-y-4">
    <Skeleton className="h-48 w-full rounded-lg" />
    <SkeletonText />
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-10 flex-1 rounded-lg" />
      <Skeleton className="h-10 flex-1 rounded-lg" />
    </div>
  </div>
);
