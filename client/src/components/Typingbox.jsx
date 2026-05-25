import { useEffect, useRef, useState } from "react";
import { useTypingBox } from "../hooks/useTyping";

const TypingBox = () => {
  const {
    targetText,
    userInput,
    timeLeft,
    mistakes,
    status,
    loadingParagraph,
    loadError,
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
    <div className="mx-auto w-4xl max-w-5xl rounded-[20px] border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-wide">Typing Test</h1>

        <div className="flex gap-4">
          <div className="rounded-2xl bg-white px-6 py-3 border border-neutral-700">
            <p className="text-xs uppercase text-neutral-900">Time Left</p>

            <p className="text-3xl font-bold">{timeLeft}s</p>
          </div>

          <div className="rounded-2xl bg-white px-6 py-3 border border-neutral-700">
            <p className="text-xs uppercase text-neutral-400">Mistakes</p>

            <p className="text-3xl font-bold">{mistakes}</p>
          </div>
        </div>
      </div>

      {/* Typing Area */}

      <div
        onClick={handleContainerClick}
        className="relative rounded-2xl bg-white px-6 py-3  border-neutral-700 p-8 min-h-[350px] border  cursor-text overflow-hidden"
      >
        {loadingParagraph && (
          <div className="text-center text-neutral-400 animate-pulse">
            Loading paragraph...
          </div>
        )}

        {loadError && (
          <div className="text-center text-red-500">{loadError}</div>
        )}

        {!loadingParagraph && !loadError && (
          <div className="text-2xl leading-[2.5rem] tracking-wide">
            {targetText.split("").map((char, index) => {
              let style = "text-neutral-500";

              if (index < userInput.length) {
                style =
                  char === userInput[index]
                    ? "text-green-400"
                    : "bg-red-500 text-white rounded px-[2px]";
              }

              const isCursor =
                index === userInput.length && status !== "finished";

              return (
                <span
                  key={index}
                  className={`${style} ${
                    isCursor && isFocused
                      ? "bg-yellow-400 text-black animate-pulse rounded"
                      : ""
                  }`}
                >
                  {char}
                </span>
              );
            })}
          </div>
        )}

        {/* Focus overlay */}

        {!isFocused &&
          status !== "finished" &&
          !loadingParagraph &&
          !loadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <button className="rounded-full bg-white px-6 py-3 font-semibold text-black hover:scale-105 transition">
                Click to continue typing
              </button>
            </div>
          )}
      </div>

      {/* Bottom actions */}

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-neutral-400">
          {status === "idle"
            ? "Start typing..."
            : status === "playing"
              ? "Typing..."
              : "Completed"}
        </p>

        {(status === "playing" || status === "finished") && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              restartGame();
              inputRef.current?.focus();
            }}
            className="rounded-xl bg-white px-6 py-3 font-bold text-black transition hover:scale-105"
          >
            Restart
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={status === "finished"}
        className="absolute opacity-0 pointer-events-none"
      />
    </div>
  );
};

export default TypingBox;
