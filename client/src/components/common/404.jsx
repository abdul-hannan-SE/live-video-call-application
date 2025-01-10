// src/components/NotFound.js
import React from "react";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 text-center">
      <div>
        <h1 className="text-4xl font-bold text-red-600">404</h1>
        <p className="text-xl text-gray-700">
          Oops! The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
