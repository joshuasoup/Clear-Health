"use client";
import React from "react";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";

const page = () => {
  return (
    <div className="bg-white flex flex-col h-screen">
      <Navbar />
      <div className="h-5/6"></div>
      <Footer />
    </div>
  );
};

export default page;
//
