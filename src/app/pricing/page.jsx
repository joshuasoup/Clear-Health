"use client";
import React from "react";
import Navbar from "../../components/NavBar";
import PricingCatalog from "../../components/PricingCatalog";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";

const Page = () => {
  return (
    <div className="bg-white flex flex-col h-screen">
      <Navbar />
      <div className="flex items-center flex-grow flex-col mb-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeOut", duration: 0.5 }}
        >
          <section className="w-full flex-center flex-col mb-3">
            <h1
              className="font-inter text-6xl pt-10 font-semibold py-10 tracking-tighter max-w-4xl text-center mx-auto px-8 "
              style={{ lineHeight: "1.2" }}
            >
              Simple pricing, no strings attatched.
            </h1>
          </section>
        </motion.div>
        <PricingCatalog />
      </div>
      <Footer />
    </div>
  );
};

export default Page;
