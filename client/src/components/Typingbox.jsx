import { useRef, useEffect, useState } from "react";
import { useTypingBox } from "../hooks/useTyping";

const TypingBox = () => {
  const {
    targetText,
    userInput,
    timeLeft,
    mistakes,
    status,
    handleInputChange,
    restartGame,
  } = useTypingBox(60);

  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    if (status === "idle") {
      inputRef.current?.focus();
    }
  }, [status]);

  const handleContainerClick = () => {
    if (status !== "finished") {
      inputRef.current?.focus();
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className="min-h-96 flex flex-col items-center justify-center bg-white text-black border-2 h-80 rounded-3xl font-mono p-6 cursor-text select-none"
    >
      {/* Stats */}
      <div className="flex items-center gap-10 mb-8 text-lg">
        <div>
          Time: <span className="font-bold text-2xl">{timeLeft}s</span>
        </div>

        <div>
          Mistakes: <span className="font-bold text-2xl">{mistakes}</span>
        </div>

        {status === "finished" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              restartGame();
            }}
            className="border border-black px-5 py-2 hover:bg-black hover:text-white transition"
          >
            Restart
          </button>
        )}
      </div>

      {/* Typing Area */}
      <div className="relative max-w-4xl text-2xl leading-relaxed border border-black p-8 rounded-lg">
        {targetText.split("").map((char, index) => {
          let colorClass = "text-gray-400";

          if (index < userInput.length) {
            colorClass =
              char === userInput[index]
                ? "text-green-500" // correct
                : "text-red-500"; // wrong
          }

          const isCursor = index === userInput.length && status !== "finished";

          return (
            <span
              key={index}
              className={`
                ${colorClass}
                ${isCursor ? "border-l-2 border-black animate-pulse" : ""}
              `}
            >
              {char}
            </span>
          );
        })}

        {/* Focus overlay */}
        {status === "playing" && !isFocused && (
          <div className="absolute inset-0 bg-white flex items-center justify-center border border-black">
            Click here to continue typing
          </div>
        )}
      </div>

      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={status === "finished"}
        className="absolute opacity-0 w-0 h-0"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      {status === "idle" && (
        <p className="mt-6 text-sm text-gray-500">Start typing...</p>
      )}
    </div>
  );
};

export default TypingBox;
