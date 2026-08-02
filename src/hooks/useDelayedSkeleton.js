import { useEffect, useState } from "react";

export function useDelayedSkeleton(delay = 500) {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn && conn.effectiveType) {
        setIsSlow(["slow-2g", "2g", "3g"].includes(conn.effectiveType));
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return isSlow || showSkeleton;
}
