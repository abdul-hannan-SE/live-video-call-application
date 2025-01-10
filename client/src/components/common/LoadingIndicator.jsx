// src/common/LoadingIndicator.js
import React from "react";

const LoadingIndicator = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4  border-orange-500 border-solid border-opacity-75"></div>
    </div>
  );
};

export default LoadingIndicator;
