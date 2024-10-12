"use client";
import React from "react";
import Navbar from "../../components/NavBar";
import PricingCatalog from "../../components/PricingCatalog";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    document.title = "Pricing Plans";
  }, []);
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
              className="font-inter text-6xl font-semibold pt-10 tracking-tighter max-w-4xl text-center mx-auto px-8 "
              style={{ lineHeight: "1.2" }}
            >
              <span style={{ color: "red" }}>Transparent</span> pricing, no
              strings attached.
            </h1>
            <p
              className=" mb-16 mt-5 font-extralight size-5 w-full"
              style={{ color: "#8f8f8f" }}
            >
              No hidden charges. Change plans or cancel at any time.
            </p>
          </section>
        </motion.div>
        <PricingCatalog />
      </div>
      <Footer />
    </div>
  );
};

export default Page;
