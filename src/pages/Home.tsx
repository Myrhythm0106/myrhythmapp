
import React from "react";
import { Navigate } from "react-router-dom";

const Home = () => {
  // Redirect to dashboard since Brain Recovery is removed
  return <Navigate to="/dashboard" replace />;
};

export default Home;
