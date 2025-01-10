// src/common/Input.js
import React from "react";

const Input = ({
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  className = "",
}) => {
  return (
    <input
      autoComplete="current-password"
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-3 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

export default Input;
