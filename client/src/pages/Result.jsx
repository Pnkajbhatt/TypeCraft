import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../service/api.js";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [session, setSession] = useState(location.state?.session || null);
  const [loading, setLoading] = useState(Boolean(sessionId && !session));
  const [error, setError] = useState("");

  const resolvedStats = session || location.state || {};
  const {
    wpm,
    mistakes,
    accuracy,
    timeTaken,
    time_taken,
    totalChars,
    typedChars,
    paragraph_text,
    targetText,
  } = resolvedStats;
  const displayParagraph = paragraph_text || targetText || "";
  const displayTotalChars =
    totalChars ?? (displayParagraph ? displayParagraph.length : 0);
  const displayTypedChars =
    typedChars ?? (session ? displayParagraph.length : undefined);
  const displayTime = timeTaken ?? time_taken;

  useEffect(() => {
    const loadSession = async () => {
      if (!sessionId || session) return;

      try {
        setLoading(true);
        const response = await api("get", `/sessions/${sessionId}`);
        setSession(response.session);
      } catch {
        setError("Session not found.");
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [sessionId, session]);

  // Agar direct /results pe aaye to home bhej do
  if (!location.state && !sessionId) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">No results found</p>
          <button
            onClick={() => navigate("/")}
            className="border-2 border-black px-6 py-2 hover:bg-black hover:text-white transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <p className="text-xl">Loading session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate("/profile")}
            className="border-2 border-black px-6 py-2 hover:bg-black hover:text-white transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-4">
      <div className="w-full max-w-xl border-2 border-black p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Results</h1>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="text-center border border-black p-4">
            <p className="text-sm uppercase tracking-wide mb-1">WPM</p>
            <p className="text-5xl font-bold">{wpm}</p>
          </div>

          <div className="text-center border border-black p-4">
            <p className="text-sm uppercase tracking-wide mb-1">Accuracy</p>
            <p className="text-5xl font-bold">{accuracy}%</p>
          </div>

          <div className="text-center border border-black p-4">
            <p className="text-sm uppercase tracking-wide mb-1">Mistakes</p>
            <p className="text-5xl font-bold">{mistakes}</p>
          </div>

          <div className="text-center border border-black p-4">
            <p className="text-sm uppercase tracking-wide mb-1">Time</p>
            <p className="text-5xl font-bold">{displayTime}s</p>
          </div>
        </div>

        <div className="text-center mb-8 border-t border-black pt-6">
          <p className="text-sm">
            Characters: <span className="font-bold">{displayTypedChars}</span> /{" "}
            {displayTotalChars}
          </p>
          {displayParagraph && (
            <p className="text-xs text-neutral-500 mt-3 px-4">
              {displayParagraph}
            </p>
          )}
          {time_taken !== undefined && timeTaken === undefined && (
            <p className="text-xs text-neutral-500 mt-2">
              Time taken: {time_taken}s
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex-1 border-2 border-black py-3 font-semibold hover:bg-black hover:text-white transition"
          >
            Try Again
          </button>

          <button
            onClick={() => window.print()}
            className="flex-1 bg-black text-white py-3 font-semibold hover:bg-white hover:text-black border-2 border-black transition"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
