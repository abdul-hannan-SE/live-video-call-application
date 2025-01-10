// src/common/InputBtn.js
import React from "react";

const InputBtn = ({ text, onClick, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-3 px-4 bg-orange-700 hover:bg-orange-800 text-white rounded-lg shadow-md  focus:outline-none ${className}`}
    >
      {text}
    </button>
  );
};

export default InputBtn;
