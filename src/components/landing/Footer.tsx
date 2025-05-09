
import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background py-12 border-t">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Annabel Aaron</h3>
            <p className="text-muted-foreground mb-4">
              Empowering you to live O.R.D.E.R.ly. Organize priorities, build 
              Routines, strengthen Discipline, Execute with focus, and Review 
              with intention.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://twitter.com/annabelaaron" 
                className="text-muted-foreground hover:text-annabel-600 transition-colors"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://linkedin.com/company/annabelaaron" 
                className="text-muted-foreground hover:text-annabel-600 transition-colors"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://github.com/annabelaaron" 
                className="text-muted-foreground hover:text-annabel-600 transition-colors"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-annabel-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-annabel-600 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-muted-foreground hover:text-annabel-600 transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/useful-info" className="text-muted-foreground hover:text-annabel-600 transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-annabel-600 transition-colors flex items-center gap-1">
                  Terms of Service
                  <ExternalLink size={14} />
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-annabel-600 transition-colors flex items-center gap-1">
                  Privacy Policy
                  <ExternalLink size={14} />
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-muted-foreground hover:text-annabel-600 transition-colors flex items-center gap-1">
                  Cookie Policy
                  <ExternalLink size={14} />
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:contact@annabelaaron.com" 
                  className="text-muted-foreground hover:text-annabel-600 transition-colors flex items-center gap-1"
                >
                  Contact Us
                  <Mail size={14} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />
        
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Annabel Aaron. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
