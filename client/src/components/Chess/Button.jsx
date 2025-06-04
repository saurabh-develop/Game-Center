import React from "react";
import clsx from "clsx";

const colorMap = {
  green: {
    base: "!bg-green-500",
    hover: "!hover:bg-green-600",
  },
  red: {
    base: "!bg-red-500",
    hover: "!hover:bg-red-600",
  },
  blue: {
    base: "!bg-blue-500",
    hover: "!hover:bg-blue-600",
  },
  yellow: {
    base: "!bg-yellow-500",
    hover: "!hover:bg-yellow-600",
  },
};

const Button = ({ onClick = () => {}, children, color }) => {
  const colorClass = colorMap[color];

  return (
    <button
      className={clsx(
        "mt-6 px-6 py-3 w-full md:w-2xs h-20 text-white !text-2xl !font-extrabold rounded-lg !outline-none !focus:ring-0 hover:outline-none transition duration-300 flex items-center justify-center gap-3",
        colorClass.base,
        colorClass.hover
      )}
      onClick={onClick}
    >
      {color === "green" ? (
        <>
          <img src="pawn (1).png" className="w-8 h-8" alt="Pawn" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
