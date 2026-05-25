import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api.js";

function Profile() {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [sessions, setSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [sessionError, setSessionError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const loadSessions = async () => {
      if (!user) return;

      setIsLoadingSessions(true);
      setSessionError("");

      try {
        const response = await api("get", "/sessions/history");
        setSessions(response.sessions || []);
      } catch {
        setSessionError("Failed to load sessions.");
      } finally {
        setIsLoadingSessions(false);
      }
    };

    loadSessions();
  }, [user]);

  const handleLogout = async () => {
    // Clear local session data and navigate to login.
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    setUser(null);
    navigate("/login");
  };

  const openSession = (session) => {
    navigate(`/results/${session.id}`, { state: { session } });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full my-5 flex-col gap-4 p-5 ">
      <section className="rounded-[20px] border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500">
              Account overview
            </p>
            <h2 className="mt-2 text-3xl font-bold uppercase tracking-tight md:text-4xl">
              Personal Details
            </h2>
          </div>

          <p className="text-sm text-neutral-500">
            Manage your profile and revisit past typing sessions.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="border border-black p-4">
            <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500">
              Name
            </p>
            <p className="mt-2 text-lg font-bold">{user.name || "-"}</p>
          </div>

          <div className="border border-black p-4">
            <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500">
              Email
            </p>
            <p className="mt-2 text-lg font-bold break-words">
              {user.email || "-"}
            </p>
          </div>

          <div className="border border-black p-4">
            <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500">
              Profession
            </p>
            <p className="mt-2 text-lg font-bold">
              {user.profession_name || user.profession_id || "-"}
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col rounded-[20px] border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500">
              Activity log
            </p>
            <h3 className="mt-2 text-2xl font-bold uppercase tracking-tight md:text-3xl">
              Session History
            </h3>
          </div>

          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            {sessions.length} total
          </span>
        </div>

        <div className="mt-5 rounded-[18px] border border-black p-4">
          {isLoadingSessions && (
            <p className="text-sm text-neutral-500">Loading sessions...</p>
          )}

          {sessionError && (
            <p className="text-sm italic text-red-600">{sessionError}</p>
          )}

          {!isLoadingSessions && !sessionError && sessions.length === 0 && (
            <p className="text-sm text-neutral-500">
              No completed sessions yet.
            </p>
          )}

          <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
            {sessions.map((session) => (
              <button
                key={session.id}
                type="button"
                onClick={() => openSession(session)}
                className="w-full border border-black bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:bg-black hover:text-white"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">
                      {new Date(session.created_at).toLocaleString()}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6">
                      {session.paragraph_text}
                    </p>
                  </div>

                  <div className="shrink-0 text-right md:pl-4">
                    <p className="text-2xl font-bold">{session.wpm} WPM</p>
                    <p className="text-[10px] uppercase tracking-[0.3em]">
                      {session.accuracy}% accuracy
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-center pt-1">
        <button
          onClick={handleLogout}
          className=" border 
          border-black 
          rounded-none 
          px-5 
          py-1.5 
          text-xl 
          uppercase 
          tracking-wider 
          font-bold 
          bg-white 
          text-black
          shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
          hover:translate-x-px
          hover:translate-y-px
          hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
          active:translate-x-0.5
          active:translate-y-0.5
          active:shadow-none
          transition-all
          duration-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
