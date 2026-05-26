import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../service/api.js";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field-specific error when user starts typing again
    if (error[e.target.name] || error.general) {
      setError({ ...error, [e.target.name]: "", general: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Fixed capital P
    setIsLoading(true);
    setError({});

    // Validation
    if (!formData.email) {
      setError({ email: "Email is required" });
      setIsLoading(false);
      return;
    }
    if (!formData.password) {
      setError({ password: "Password is required" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await api("post", "/auth/login", formData);

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/");
    } catch (err) {
      if (err.response?.data?.error) {
        setError({ general: err.response.data.error });
      } else {
        setError({ general: "Login failed. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-md border border-black p-8 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight uppercase mb-1">
            Welcome Back to TypeCraft
          </h2>
          <p className="text-sm text-neutral-500">
            Master your profession, one keystroke at a time.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error.general && (
            <div className="border border-black bg-neutral-100 text-xs uppercase p-3 font-semibold tracking-wider">
              {error.general}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold mb-2">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-black p-3 rounded-none focus:outline-none focus:bg-neutral-50 text-sm tracking-wide transition-colors"
              placeholder="you@example.com"
            />
            {error.email && (
              <p className="text-xs text-neutral-500 mt-1 italic">
                {error.email}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs uppercase tracking-wider font-bold">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-neutral-500 hover:text-black underline underline-offset-2"
              >
                Forgot password?
              </Link>
            </div>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-black p-3 rounded-none focus:outline-none focus:bg-neutral-50 text-sm tracking-wide transition-colors"
              placeholder="••••••••"
            />
            {error.password && (
              <p className="text-xs text-neutral-500 mt-1 italic">
                {error.password}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded-none border-black text-black focus:ring-0 accent-black cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 text-xs uppercase tracking-wider cursor-pointer select-none"
            >
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full border border-black bg-black text-white hover:bg-white hover:text-black font-bold uppercase tracking-widest text-xs py-4 transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none rounded-none"
          >
            {isLoading ? "Logging in..." : "Sign In"}
          </button>

          <div className="text-center pt-2 text-xs uppercase tracking-wider text-neutral-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-black font-bold underline underline-offset-4 hover:text-neutral-600"
            >
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
