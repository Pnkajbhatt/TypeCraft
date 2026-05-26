import { Link } from "react-router-dom";

function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-md border border-black p-8 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
        <h2 className="text-2xl font-bold tracking-tight uppercase mb-3">
          Forgot Password
        </h2>
        <p className="text-sm text-neutral-500 mb-6">
          Password reset is not implemented yet.
        </p>
        <Link
          to="/login"
          className="inline-block border border-black bg-black text-white hover:bg-white hover:text-black font-bold uppercase tracking-widest text-xs px-5 py-3 transition-colors duration-200"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
