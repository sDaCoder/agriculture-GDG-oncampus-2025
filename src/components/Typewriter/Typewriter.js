import { useEffect, useState } from "react";

const Typewriter = ({ text, speed = 30, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText(""); // reset when text changes
  }, [text]);

  useEffect(() => {
    if (!text) return;

    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index === text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <div className="whitespace-pre-wrap">
      {displayedText}
    </div>
  );
};

export default Typewriter;