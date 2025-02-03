import React from "react";

const Button = ({ onClick = () => {}, children }) => {
  return (
    <>
      <button
        className="mt-6 px-6 py-3 w-full md:w-2xs h-20 !bg-green-500 hover:!bg-green-600 text-white !text-2xl !font-extrabold rounded-lg !outline-none !focus:ring-0 hover:outline-none transition duration-300 flex items-center justify-center gap-3"
        onClick={onClick}
      >
        <img src="pawn (1).png" className="w-8 h-8" alt="Pawn" />
        {children}
      </button>
    </>
  );
};

export default Button;
