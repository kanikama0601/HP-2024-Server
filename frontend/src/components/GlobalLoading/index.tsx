'use client';

import { Loading } from "@/components/Loading";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const GlobalLoading: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const begin = () => setLoading(true);
    const end = () => setLoading(false);

    window.addEventListener("app-loading-start", begin);
    window.addEventListener("app-loading-end", end);

    return () => {
      window.removeEventListener("app-loading-start", begin);
      window.removeEventListener("app-loading-end", end);
    };
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  return loading ? <Loading /> : null;
};
