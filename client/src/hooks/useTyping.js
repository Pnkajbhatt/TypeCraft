import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api.js";

export const useTypingBox = (initialTime = 60) => {
  const navigate = useNavigate();

  const [targetText, setTargetText] = useState("");
  const [paragraphId, setParagraphId] = useState(null);
  const [loadingParagraph, setLoadingParagraph] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState("idle");
  const [wpm, setWpm] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const timerRef = useRef(null);
  const hasSavedRef = useRef(false);

  useEffect(() => {
    const loadParagraph = async () => {
      try {
        setLoadingParagraph(true);
        setLoadError("");

        const response = localStorage.getItem("token")
          ? await api("get", "/paragraphs/new")
          : await api("get", "/paragraphs/guest");
        setParagraphId(response.paragraph.id);
        setTargetText(response.paragraph.text);
      } catch {
        setLoadError("Failed to load paragraph.");
      } finally {
        setLoadingParagraph(false);
      }
    };

    loadParagraph();
  }, []);

  useEffect(() => {
    if (status !== "playing") {
      return undefined;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((currentTimeLeft) => {
        if (currentTimeLeft <= 1) {
          clearInterval(timerRef.current);
          setStatus("finished");
          return 0;
        }

        return currentTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [status]);

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      if (status === "finished") return;
      if (value.length > targetText.length) return;
      if (!targetText) return;

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
    hasSavedRef.current = false;
    setUserInput("");
    setTimeLeft(initialTime);
    setMistakes(0);
    setStatus("idle");
    setWpm(0);
    setStartTime(null);
  }, [initialTime]);
  useEffect(() => {
    if (status === "finished" && paragraphId && !hasSavedRef.current) {
      hasSavedRef.current = true;

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

      api("post", "/sessions/complete", {
        paragraph_id: paragraphId,
        wpm: finalWpm,
        accuracy,
        mistakes,
        time_taken: timeTaken,
      })
        .then(() => {
          sessionStorage.setItem(`saved_session_${paragraphId}`, "1");
          navigate("/results", {
            state: {
              finalWpm,
              mistakes,
              accuracy,
              timeTaken,
              totalChars: targetText.length,
              typedChars: userInput.length,
              targetText,
            },
          });
        })
        .catch(() => {
          sessionStorage.setItem(`saved_session_${paragraphId}`, "1");
          navigate("/results", {
            state: {
              finalWpm,
              mistakes,
              accuracy,
              timeTaken,
              totalChars: targetText.length,
              typedChars: userInput.length,
              targetText,
            },
          });
        });
    }
  }, [
    status,
    paragraphId,
    startTime,
    initialTime,
    timeLeft,
    userInput,
    mistakes,
    targetText,
    navigate,
  ]);
  return {
    targetText,
    userInput,
    timeLeft,
    mistakes,
    status,
    wpm,
    loadingParagraph,
    loadError,
    handleInputChange,
    restartGame,
  };
};
