import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../utils/auth.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      navigate("/game-selection");
    } else {
      alert(data.error || "Login failed");
    }
  };

  const handleGuestLogin = () => {
    setToken("guest-token");
    navigate("/game-selection");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900 px-4">
      <img
        src="/controller.png"
        alt="Controller"
        className="absolute top-[-30px] right-[-30px] w-40 opacity-40 rotate-12 pointer-events-none hidden md:block"
      />
      <img
        src="/controller.png"
        alt="Controller"
        className="absolute bottom-[-20px] left-[-20px] w-28 opacity-20 -rotate-12 pointer-events-none hidden md:block"
      />
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl p-8 w-full max-w-md text-white"
      >
        <h2 className="text-3xl font-extrabold mb-2 text-center">
          Welcome Back
        </h2>
        <p className="text-white/80 mb-6 text-center">Login to your account</p>

        <div className="space-y-4">
          <input
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-pink-500 hover:bg-pink-600 transition py-3 rounded-xl font-bold text-lg cursor-pointer"
        >
          Login
        </button>

        <button
          type="button"
          onClick={handleGuestLogin}
          className="mt-4 w-full border border-white/30 text-white hover:bg-white/10 transition py-3 rounded-xl font-medium cursor-pointer"
        >
          Play as Guest
        </button>

        <p className="mt-6 text-sm text-white/70 text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-pink-400 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
