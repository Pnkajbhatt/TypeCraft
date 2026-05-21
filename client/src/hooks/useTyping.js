import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // ADD 1: import karo

export const useTypingBox = (initialTime = 60) => {
  const navigate = useNavigate(); // ADD 2: navigate function le lo

  const dummyText =
    "React is a free and open-source front-end JavaScript library for building user interfaces based on components. Tailwind CSS is a utility-first CSS framework for rapid UI development.";

  const [targetText] = useState(dummyText);
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState("idle");
  const [wpm, setWpm] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const timerRef = useRef(null);

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      if (status === "finished") return;
      if (value.length > targetText.length) return;

      if (status === "idle") {
        setStatus("playing");
        setStartTime(Date.now());
      }

      let currentMistakes = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] !== targetText[i]) {
          currentMistakes++;
        }
      }

      if (startTime) {
        const timeElapsedInMinutes = (Date.now() - startTime) / 1000 / 60;
        const wordsTyped = value.length / 5;
        const currentWpm =
          timeElapsedInMinutes > 0
            ? Math.round(wordsTyped / timeElapsedInMinutes)
            : 0;
        setWpm(currentWpm);
      }

      setMistakes(currentMistakes);
      setUserInput(value);

      if (value.length === targetText.length) {
        setStatus("finished");
        clearInterval(timerRef.current);
      }
    },
    [status, targetText, startTime],
  );

  const restartGame = useCallback(() => {
    clearInterval(timerRef.current);
    setUserInput("");
    setTimeLeft(initialTime);
    setMistakes(0);
    setStatus("idle");
    setWpm(0);
    setStartTime(null);
  }, [initialTime]);

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

  // ADD 3: Jab game finish ho to results page pe bhej do
  useEffect(() => {
    if (status === "finished") {
      const timeTaken = startTime
        ? Math.round((Date.now() - startTime) / 1000)
        : initialTime - timeLeft;
      const accuracy =
        userInput.length > 0
          ? Math.round(((userInput.length - mistakes) / userInput.length) * 100)
          : 0;

      const finalWpm = startTime
        ? Math.round(
            userInput.length / 5 / ((Date.now() - startTime) / 1000 / 60),
          )
        : 0;
      navigate("/results", {
        state: {
          wpm,
          finalWpm,
          mistakes,
          accuracy,
          timeTaken, // seconds me
          totalChars: targetText.length,
          typedChars: userInput.length,
          targetText,
        },
      });
    }
  }, [
    status,
    navigate,
    wpm,
    mistakes,
    userInput,
    targetText,
    startTime,
    timeLeft,
    initialTime,
  ]);

  return {
    targetText,
    userInput,
    timeLeft,
    mistakes,
    status,
    wpm,
    handleInputChange,
    restartGame,
  };
};
