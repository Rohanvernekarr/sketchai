import { useState, useEffect } from "react";

export function useBlinkingCursor(isActive: boolean) {
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!isActive) {
      setShowCursor(false);
      return;
    }

    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500); // Blink every 500ms

    return () => clearInterval(interval);
  }, [isActive]);

  return showCursor;
}
