import React, { useEffect, useState } from "react";
import Button from "./Button";
import Menu from "../Menu";
import { useNavigate } from "react-router-dom";

const LandingChess = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4">
      {/* Sidebar Menu */}
      <div className="md:col-span-1 flex items-center justify-center md:justify-start">
        <Menu />
      </div>

      {/* Chess Board Image */}
      <div className="md:col-span-3 flex justify-center">
        <img
          src="/chessBoard.png"
          className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
          alt="Chess Board"
        />
      </div>

      {/* Right Panel */}
      <div className="md:col-span-2 p-6 text-center md:text-left flex justify-center flex-col items-center">
        <h1 className="font-bold text-xl md:text-2xl lg:text-3xl mt-4 md:mt-10 text-center">
          Play Chess Online on the #1 Site!
        </h1>
        <Button
          onClick={() => {
            navigate("/chessBoard");
          }}
          color={"green"}
        >
          Play Online
        </Button>
      </div>
    </div>
  );
};

export default LandingChess;
