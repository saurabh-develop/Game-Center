import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const Landing = () => {
  const icons = [
    { src: "/trophy.png", className: "top-8 right-8 w-40" },
    { src: "/controller.png", className: "top-1/3 right-24 w-35" },
    { src: "/coin.png", className: "bottom-10 right-16 w-20" },
    { src: "/heart.png", className: "bottom-15 left-8 w-35" },
    { src: "/star.png", className: "top-1/4 left-24 w-15" },
    { src: "/coins.png", className: "bottom-45 left-32 w-30" },
    { src: "/coin.png", className: "top-2/3 left-12 w-15" },
    { src: "/controller.png", className: "bottom-10 left-1/2 w-20" },
  ];

  return (
    <div className="relative min-h-screen min-w-screen overflow-hidden text-white flex flex-col items-center justify-center px-4 py-10">
      {/* Floating Interactive Icons */}
      {icons.map((icon, index) => (
        <img
          key={index}
          src={icon.src}
          alt={`icon-${index}`}
          className={`absolute ${icon.className} opacity-90 cursor-pointer animate-float transition-transform duration-300 hover:scale-110 hover:rotate-6`}
          onClick={() => alert("You clicked a game element!")}
        />
      ))}

      {/* Hero Content */}
      <div className="z-10 text-center max-w-2xl">
        <h1 className="text-7xl font-bold font-poppins mb-4 p-4 tracking-tight">
          GAME CENTER
        </h1>
        <p className="text-3xl md:text-2xl font-semibold mb-2">
          Play & have fun
        </p>
        <p className="text-xl md:text-lg mb-6 pb-2">
          Discover different games, compete with friends, and more.
        </p>
        <Link to="/login">
          <button className="bg-pink-500 hover:bg-pink-600 text-white text-lg font-bold py-3 px-6 rounded-full shadow-lg transition cursor-pointer">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
