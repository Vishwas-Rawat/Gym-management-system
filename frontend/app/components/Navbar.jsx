"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "../LoginAndReg/Context/ThemeContext";

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800 py-4 fixed top-0 left-0 right-0 z-50 animate-fade-in transition-colors duration-200">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Users className="w-8 h-8 text-green-500" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            GYM <span className="text-green-500">bro's</span>
          </span>
        </Link>

        {/* Theme Toggle and Hamburger Menu */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          {/* <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle theme"
            disabled
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button> */}

          {/* Hamburger Menu for Mobile */}
          <button
            className="md:hidden text-gray-600 dark:text-gray-300 hover:text-green-500 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            disabled
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`${
            isMobileMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-center gap-6 absolute md:static top-16 left-0 right-0 bg-white dark:bg-gray-900 md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none`}
        >
          <Link
            href="/"
            className="font-medium text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="font-medium text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors duration-200"
          >
            About
          </Link>
          <Link
            href="/features"
            className="font-medium text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="font-medium text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors duration-200"
          >
            Pricing
          </Link>
          <Link
            href="/Admin/GymAdmin/memberManagement"
            className="font-medium text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors duration-200"
          >
            Members
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/LoginAndReg/Login"
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/LoginAndReg/Register"
            className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 font-medium transition-colors duration-200"
          >
            Ragister Your Gym
          </Link>
        </div>
      </div>

      {/* Mobile Action Buttons */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col gap-4 p-4 bg-white dark:bg-gray-900 shadow-md">
          <Link
            href="/LoginAndReg/Login"
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-center transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/LoginAndReg/Register"
            className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 font-medium text-center transition-colors duration-200"
          >
            Ragister Your Gym
          </Link>
        </div>
      )}
    </nav>
  );
}
