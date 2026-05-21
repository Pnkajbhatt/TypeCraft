import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../service/api.js";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password_hash: "",
    profession_name: "normal",
  });

  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const professions = [
    { key: "normal", label: "Normal" },
    { key: "doctor", label: "Doctor" },
    { key: "coder", label: "Coder" },
    { key: "architecture", label: "Architecture" },
    { key: "lawyer", label: "Lawyer" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error[e.target.name] || error.general) {
      setError({ ...error, [e.target.name]: "", general: "" });
    }
  };

  const handleProfessionClick = (key) => {
    setFormData({ ...formData, profession_name: key });
    if (error.profession_name) setError({ ...error, profession_name: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError({});

    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password_hash)
      newErrors.password_hash = "Password is required";
    if (!formData.profession_name)
      newErrors.profession_name = "Select profession";

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api("post", "/auth/register", formData);

      localStorage.setItem(
        "token",
        response.data.user?.token || response.data.token,
      );
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user || response.data),
      );
      navigate("/");
    } catch (err) {
      if (err.response?.data?.error) {
        setError({ general: err.response.data.error });
      } else {
        setError({ general: "Registration failed. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-md border border-black p-8 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight uppercase mb-1">
            Create Account
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
              Name
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-black p-3 rounded-none focus:outline-none focus:bg-neutral-50 text-sm tracking-wide transition-colors"
              placeholder="Your full name"
            />
            {error.name && (
              <p className="text-xs text-red-600 mt-1 italic">{error.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold mb-2">
              Email
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
              <p className="text-xs text-red-600 mt-1 italic">{error.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold mb-2">
              Password
            </label>
            <input
              name="password_hash"
              type="password"
              value={formData.password_hash}
              onChange={handleChange}
              className="w-full border border-black p-3 rounded-none focus:outline-none focus:bg-neutral-50 text-sm tracking-wide transition-colors"
              placeholder="••••••••"
            />
            {error.password_hash && (
              <p className="text-xs text-red-600 mt-1 italic">
                {error.password_hash}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold mb-2">
              Profession
            </label>
            <div className="grid grid-cols-2 gap-3">
              {professions.map((p) => {
                const selected = formData.profession_name === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => handleProfessionClick(p.key)}
                    className={`border ${selected ? "border-black bg-black text-white" : "border-black bg-white text-black"} p-3 text-sm font-semibold tracking-wider rounded-none transition-colors`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
            {error.profession_name && (
              <p className="text-xs text-red-600 mt-1 italic">
                {error.profession_name}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full border border-black bg-black text-white hover:bg-white hover:text-black font-bold uppercase tracking-widest text-xs py-4 transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none rounded-none"
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>

          <div className="text-center pt-2 text-xs uppercase tracking-wider text-neutral-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-black font-bold underline underline-offset-4 hover:text-neutral-600"
            >
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
