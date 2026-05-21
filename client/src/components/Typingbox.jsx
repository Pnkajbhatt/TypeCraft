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
    <div className="h-full flex items-center justify-center bg-white text-black px-4 py-1">
      <div
        onClick={handleContainerClick}
        className="w-full max-w-2xl border border-black p-6 rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white cursor-text select-none"
      >
        {/* Stats Section */}
        <div className="flex items-center justify-between border-b border-black pb-6 mb-6">
          <div className="flex gap-8 text-xs uppercase tracking-widest font-bold">
            <div>
              Time:{" "}
              <span className="text-xl block font-black mt-1">{timeLeft}s</span>
            </div>
            <div>
              Mistakes:{" "}
              <span className="text-xl block font-black mt-1">{mistakes}</span>
            </div>
          </div>

          {(status === "finished" || status === "playing") && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                restartGame();
                inputRef.current?.focus();
              }}
              className="border border-black bg-black text-white hover:bg-white hover:text-black px-5 py-2 text-xs uppercase tracking-wider font-bold transition-colors duration-150 rounded-none"
            >
              Restart
            </button>
          )}
        </div>

        {/* Typing Area Container */}
        <div
          className="relative border border-black p-6 rounded-none bg-white"
          style={{ minHeight: "100px" }}
        >
          <div className="text-xl font-mono leading-relaxed tracking-wide word-break">
            {targetText.split("").map((char, index) => {
              let charStyle = "text-neutral-600"; // Default: Untyped (darker)

              if (index < userInput.length) {
                charStyle =
                  char === userInput[index]
                    ? "text-black font-semibold" // Correct: Crisp Black
                    : "bg-black text-white px-[1px]"; // Mistake: High-contrast Inverted Block
              }

              const isCursor =
                index === userInput.length && status !== "finished";

              return (
                <span
                  key={index}
                  className={`relative ${charStyle} ${
                    isCursor && isFocused
                      ? "bg-neutral-300 text-black animate-pulse"
                      : ""
                  }`}
                >
                  {char}
                </span>
              );
            })}
          </div>

          {/* Focus overlay (Pure Minimalist Style) */}
          {!isFocused && status !== "finished" && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-4 border border-dashed border-black -m-px">
              <p className="text-xs uppercase tracking-widest font-bold bg-black text-white px-3 py-1.5">
                Click here to focus
              </p>
            </div>
          )}
        </div>

        {/* Hidden Native Input */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={status === "finished"}
          className="absolute opacity-0 w-0 h-0 pointer-events-none"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />

        {status === "idle" && (
          <p className="mt-4 text-xs uppercase tracking-wider text-neutral-400 font-medium animate-pulse">
            Activate keyboard to begin...
          </p>
        )}
      </div>
    </div>
  );
};

export default TypingBox;
