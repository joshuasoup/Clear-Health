"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import medicalLogo from "../../assets/images/clearhealthlogo.png";
import { useUser } from "@clerk/clerk-react";
import "../../styles/globals.css";

const Navbar = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const { user } = useUser();
  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center h-16">
          {/* Brand and logo area */}
          <Link href="/">
            <div className="flex items-center text-gray-800 text-xl font-bold">
              <Image src={medicalLogo} alt="Logo" width={40} height={40} />
              <span className="ml-2 font-inter font-semibold tracking-tighter text-2xl">
                Clear Health
              </span>
            </div>
          </Link>

          {/* Centered navigation links (visible only on medium screens and above) */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-4">
            <Link href="/about">
              <h1 className="text-gray-700 hover:text-gray-900 px-3">About</h1>
            </Link>
            <Link href="/roadmap">
              <h1 className="text-gray-700 hover:text-gray-900 px-3">
                Roadmap
              </h1>
            </Link>
            <Link href="/pricing">
              <h1 className="text-gray-700 hover:text-gray-900 px-3">
                Pricing
              </h1>
            </Link>
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <Link href={user ? "/pdf-viewer" : "/sign-in"}>
              <h1 className="text-gray-700 hover:text-gray-900 px-3 mr-4">
                Log In
              </h1>
            </Link>
            <Link href={user ? "/pdf-viewer" : "/sign-in"}>
              <h1
                className="special-button"
                style={{ fontWeight: "599", letterSpacing: ".7px" }}
              >
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

      {/* Mobile menu (shown when isNavCollapsed is false) */}
      <div className={`${isNavCollapsed ? "hidden" : "block"} md:hidden`}>
        <Link href="/pricing">
          <h1 className="block py-2 px-4 text-sm hover:bg-gray-200">Pricing</h1>
        </Link>
        <Link href="/about">
          <h1 className="block py-2 px-4 text-sm hover:bg-gray-200">About</h1>
        </Link>
        <Link href="/roadmap">
          <h1 className="block py-2 px-4 text-sm hover:bg-gray-200">Roadmap</h1>
        </Link>
        {/* Add additional mobile menu items here */}
      </div>
    </nav>
  );
};

export default Navbar;
