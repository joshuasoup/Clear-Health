"use client";
import React from "react";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { FooterTitle } from "flowbite-react";

const page = () => {
  return (
    <div className="bg-white h-screen flex flex-col">
      <Navbar />
      <div className="h-5/6"></div>
      <Footer />
    </div>
  );
};

export default page;
