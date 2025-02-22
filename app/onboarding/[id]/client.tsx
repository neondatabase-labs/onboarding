"use client";

import { ReactNode, useEffect } from "react";

export const Poll = ({
  periodMs = 5000,
  action,
  children,
}: {
  periodMs?: number;
  action: () => void;
  children: ReactNode | null;
}) => {
  useEffect(() => {
    const interval = setInterval(() => {
      action();
    }, periodMs);
    return () => clearInterval(interval);
  }, [action, periodMs]);
  return children;
};
