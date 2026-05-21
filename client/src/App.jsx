import Navbar from "./components/Navbar";
import Home from "./pages/Hero";
import Login from "./pages/Login.jsx";
import Results from "./pages/Result.jsx";
import Register from "./pages/Registration.jsx";
import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <div className="font-mono font-bold min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Ye container hai saare Route ka */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/results" element={<Results />} />
          {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
