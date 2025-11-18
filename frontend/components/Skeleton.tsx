"use client";

import type { HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

export function Skeleton({ className = "", ...rest }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-skeleton rounded-md bg-zinc-200/60 ${className}`}
      {...rest}
    />
  );
}
