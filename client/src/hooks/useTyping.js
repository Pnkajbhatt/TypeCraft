import { useEffect, useState, useRef, useCallback } from "react";

export const useTypingBox = (initialTime = 60) => {
  const dummyText =
    "React is a free and open-source front-end JavaScript library for building user interfaces based on components. Tailwind CSS is a utility-first CSS framework for rapid UI development.";

  const [targetText] = useState(dummyText);
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState("idle");

  const timerRef = useRef(null);

  // Handle typing
  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;

      // Stop typing if game finished
      if (status === "finished") return;

      // Prevent typing beyond target text length
      if (value.length > targetText.length) return;

      // Start timer on first key press
      if (status === "idle") {
        setStatus("playing");
      }

      // Live mistake calculation
      let currentMistakes = 0;

      for (let i = 0; i < value.length; i++) {
        if (value[i] !== targetText[i]) {
          currentMistakes++;
        }
      }

      setMistakes(currentMistakes);
      setUserInput(value);

      // Finish when text completed
      if (value === targetText) {
        setStatus("finished");
        clearInterval(timerRef.current);
      }
    },
    [status, targetText],
  );

  // Restart game
  const restartGame = useCallback(() => {
    clearInterval(timerRef.current);

    setUserInput("");
    setTimeLeft(initialTime);
    setMistakes(0);
    setStatus("idle");
  }, [initialTime]);

  // Timer logic
  useEffect(() => {
    if (status !== "playing") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          setStatus("finished");
          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [status]);

  return {
    targetText,
    userInput,
    timeLeft,
    mistakes,
    status,
    handleInputChange,
    restartGame,
  };
};
