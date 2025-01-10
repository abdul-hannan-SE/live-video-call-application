// src/components/Home/Home.js
import React from "react";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full h-screen bg-gray-100">
      <Outlet />
    </div>
  );
};

export default Home;
