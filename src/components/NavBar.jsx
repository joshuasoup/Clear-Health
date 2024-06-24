"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import medicalLogo from "../assets/clearhealthlogo.png";
import { useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const { user } = useUser();
  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  return (
    <nav className="bg-white ">
      <div className="max-w-7xl mx-auto px-4 py-2 ">
        <div className="flex justify-between items-center h-16">
          {/* Brand and logo area */}
          <Link href="/">
            <div className="flex items-center text-gray-800 text-xl font-bold">
              {/* Replace the src with your logo image path and adjust width and height accordingly */}
              <Image src={medicalLogo} alt="Logo" width={40} height={40} />
              <span className="ml-3 font-inter  font-semibold tracking-tighter">
                Clear Health
              </span>
            </div>
          </Link>

          {/* Centered navigation links */}
          <div className="flex-1 flex justify-center items-center space-x-4">
            <Link href="/pricing">
              <h1 className="text-gray-700 hover:text-gray-900 px-3">
                Pricing
              </h1>
            </Link>
            <Link href="/about">
              <h1 className="text-gray-700 hover:text-gray-900 px-3">About</h1>
            </Link>
            <Link href="/blog">
              <h1 className="text-gray-700 hover:text-gray-900 px-3">Blog</h1>
            </Link>
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <Link href={user ? "/pdf-viewer" : "/sign-in"}>
              <h1 className="text-gray-700 hover:text-gray-900 px-3">Log In</h1>
            </Link>
            <Link href="/sign-out">
              <h1 className="px-5 py-2 rounded-md bg-red-600 text-white">
                Start Learning
              </h1>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={handleNavCollapse}>
              {/* Icon for mobile menu */}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isNavCollapsed ? "hidden" : "block"} md:hidden`}>
        <Link href="/pricing">
          <h1 className="block py-2 px-4 text-sm hover:bg-gray-200">Pricing</h1>
        </Link>
        <Link href="/about">
          <h1 className="block py-2 px-4 text-sm hover:bg-gray-200">About</h1>
        </Link>
        <Link href="/blog">
          <h1 className="block py-2 px-4 text-sm hover:bg-gray-200">Blog</h1>
        </Link>
        {/* Add additional mobile menu items here */}
      </div>
    </nav>
  );
};

export default Navbar;
