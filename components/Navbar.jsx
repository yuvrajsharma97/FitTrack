"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "./ThemeProvider";
import { Menu, X, Sun, Moon, Dumbbell } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center space-x-2 font-bold text-xl">
            <Dumbbell className="h-6 w-6 text-violet-500" />
            <span>FitTrack</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-foreground hover:text-violet-500 transition-colors">
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="text-foreground hover:text-violet-500 transition-colors">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-foreground hover:text-violet-500 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className="text-foreground hover:text-violet-500 transition-colors">
                  Home
                </Link>
                <Link
                  href="/auth/login"
                  className="text-foreground hover:text-violet-500 transition-colors">
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600 transition-colors">
                  Signup
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent transition-colors">
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent transition-colors">
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-accent transition-colors">
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-foreground hover:text-violet-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="text-foreground hover:text-violet-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link
                    href="/attendance"
                    className="text-foreground hover:text-violet-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}>
                    Attendance
                  </Link>
                  <Link
                    href="/load-plan"
                    className="text-foreground hover:text-violet-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}>
                    Load Plan
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-foreground hover:text-violet-500 transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className="text-foreground hover:text-violet-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}>
                    Home
                  </Link>
                  <Link
                    href="/auth/login"
                    className="text-foreground hover:text-violet-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}>
                    Signup
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
