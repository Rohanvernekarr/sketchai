import { useEffect, useRef } from "react";
import gsap from "gsap";

export const TypingText = ({
  text,
  speed = 0.05,
  className = "",
}: {
  text: string;
  speed?: number;
  className?: string;
}) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const letters = textRef.current.querySelectorAll(".typing-letter");
      gsap.set(letters, { opacity: 0, y: 10 });
      gsap.to(letters, {
        opacity: 1,
        y: 0,
        stagger: speed,
        delay: 0.2,
        ease: "power1.out",
      });
    }
  }, [text, speed]);

  return (
    <div ref={textRef} className={className}>
      {text.split("").map((letter, i) => (
        <span key={i} className="typing-letter whitespace-pre">
          {letter}
        </span>
      ))}
    </div>
  );
};
