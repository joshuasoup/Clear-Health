"use client";
import React from "react";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";

const page = () => {
  return (
    <div className="bg-white h-screen flex flex-col ">
      <Navbar />
      <div className="bg-white flex flex-col items-center h-screen px-24 py-12 max-w-about mx-auto w-page">
        <div className="flex text-left justify-start w-full">
          <h2 className="text-7xl font-bold text-black mb-10 text-left">
            Next steps...
          </h2>
        </div>

        <div className="relative">
          {/* First Step */}
          <div className="flex justify-center items-center bg-gray-300 w-72 h-32 rounded-lg mb-16">
            <p className="text-lg">Step 1</p>
          </div>

          {/* Dotted Line 1 */}
          <svg
            className="absolute top-32 left-1/2 transform -translate-x-1/2"
            width="2"
            height="150"
            viewBox="0 0 2 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 0 L1 150"
              stroke="black"
              strokeDasharray="5,5"
              strokeWidth="2"
            />
          </svg>

          {/* Second Step */}
          <div className="flex justify-center items-center bg-gray-300 w-80 h-36 rounded-lg mb-16">
            <p className="text-lg">Step 2</p>
          </div>

          {/* Dotted Line 2 */}
          <svg
            className="absolute top-80 left-1/2 transform -translate-x-1/2"
            width="2"
            height="150"
            viewBox="0 0 2 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 0 L1 150"
              stroke="black"
              strokeDasharray="5,5"
              strokeWidth="2"
            />
          </svg>

          {/* Third Step */}
          <div className="flex justify-center items-center bg-gray-300 w-72 h-32 rounded-lg">
            <p className="text-lg">Step 3</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default page;
