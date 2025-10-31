import React from "react";
import { Link } from "react-router-dom";

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 py-12 border-t border-gray-200">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-gray-600">
            &copy; {currentYear} MyRhythm. All rights reserved.
          </div>
          <div className="flex gap-8 text-sm">
            <Link to="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
              Privacy
            </Link>
            <Link to="/founders-story" className="text-gray-600 hover:text-gray-900 transition-colors">
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
