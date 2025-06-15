import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../utils/auth.js";

export default function Registration() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      navigate("/game-selection");
    } else {
      alert(data.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900 px-4 relative overflow-hidden">
      {/* Decorative Controller Images */}
      <img
        src="/controller.png"
        alt="Controller"
        className="absolute top-[-30px] right-[-30px] w-40 opacity-20 rotate-12 pointer-events-none hidden md:block"
      />
      <img
        src="/controller.png"
        alt="Controller"
        className="absolute bottom-[-20px] left-[-20px] w-28 opacity-20 -rotate-12 pointer-events-none hidden md:block"
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl p-8 w-full max-w-md text-white z-10"
      >
        <h2 className="text-3xl font-extrabold mb-2 text-center">
          Create Account
        </h2>
        <p className="text-white/80 mb-6 text-center">Join the Game Center</p>

        <div className="space-y-4">
          <input
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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
          Register
        </button>

        <p className="mt-6 text-sm text-white/70 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-pink-400 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
