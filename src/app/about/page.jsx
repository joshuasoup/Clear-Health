"use client";
import React from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";

const page = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: "easeInOut" } },
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  return (
    <div className="bg-white flex flex-col h-screen">
      <Navbar />
      <div className="mx-auto py-12 max-w-about px-24">
        {/* Mission Section */}
        <motion.section
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <motion.h1
            className="text-7xl font-bold font-inter tracking-tighter text-gray-900 mb-6 text-left leading-tight"
            variants={fadeInUp}
          >
            People deserve clarity when it comes to their health. We eliminate
            the barrier between complex medical language and clear, simple
            explanations.
          </motion.h1>
          <motion.div
            className="bg-gray-300 w-full h-96 rounded-xl mx-auto mt-16"
            variants={scaleUp}
          ></motion.div>
        </motion.section>

        {/* Why Clear Health Section */}
        <motion.section
          className="text-left mb-16 mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-6xl font-bold text-gray-900 mb-8"
            variants={fadeInUp}
          >
            Our Goals
          </motion.h2>

          <motion.div className="flex flex-col md:flex-row justify-center gap-8">
            {/* Empowerment Through Knowledge */}
            <motion.div
              className="bg-white border border-gray-100 p-6 rounded-lg shadow-lg max-w-lg minx-w-96"
              variants={fadeInUp}
            >
              <h3 className="text-2xl font-semibold mb-4">
                Empowerment Through Knowledge
              </h3>
              <p className="text-gray-700">
                We make complex medical information simple, giving users the
                clarity they need to take charge of their health.
              </p>
            </motion.div>

            {/* Compassionate Clarity */}
            <motion.div
              className="bg-white border border-gray-100 p-6 rounded-lg shadow-lg max-w-lg min-w-96"
              variants={fadeInUp}
            >
              <h3 className="text-2xl font-semibold mb-4">
                Compassionate Clarity
              </h3>
              <p className="text-gray-700">
                In moments of uncertainty, we aim to provide clear,
                compassionate support, helping users understand their health
                with confidence.
              </p>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Founders Section */}
        <motion.section
          className="text-left mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-black mb-4"
            variants={fadeInUp}
          >
            Founders
          </motion.h2>
          <div className="mt-10 flex flex-row justify-start items-stretch gap-8">
            <motion.div
              className="bg-transparent flex flex-col justify-start max-w-lg text-left mr-10"
              variants={scaleUp}
            >
              <div className="bg-gray-300 w-64 h-64 rounded-lg mb-6"></div>
              <h3 className="text-3xl font-semibold mb-2 text-gray-600 font-inter tracking-tighter">
                Joshua Souphanthong
              </h3>
            </motion.div>
            <motion.div className="flex items-center h-64" variants={fadeInUp}>
              <p className="text-xl text-gray-900 tracking-tighter font-inter">
                When a close family member was diagnosed with pancreatic cancer,
                I remember the overwhelming feeling of confusion as I tried to
                make sense of the initial medical scan. The terms were foreign,
                and the meaning was unclear. With Clear Health, I want to help
                even one person avoid that initial sense of helplessness, by
                offering an easy, accessible way to understand their medical
                reports right from the start.
              </p>
            </motion.div>
          </div>
        </motion.section>
      </div>
      <Footer />
    </div>
  );
};

export default page;
