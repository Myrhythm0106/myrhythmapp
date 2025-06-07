
import React from "react";
import { Navigate } from "react-router-dom";

const Home = () => {
  // Redirect to landing page to show the original content
  return <Navigate to="/" replace />;
};

export default Home;
