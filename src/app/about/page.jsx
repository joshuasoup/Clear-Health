"use client";
import React from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Image from "next/image";
import { useEffect } from "react";

const page = () => {
  useEffect(() => {
    document.title = "About Us";
  }, []);

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
    <div className="bg-white flex flex-col min-h-screen">
      <Navbar />
      <div className="mx-auto py-12 max-w-7xl px-4 sm:px-6 lg:px-24">
        {/* Mission Section */}
        <motion.section
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <motion.h1
            className="text-3xl sm:text-5xl lg:text-7xl font-bold font-inter tracking-tighter text-gray-900 mb-6 text-left leading-snug sm:leading-tight"
            variants={fadeInUp}
          >
            People deserve clarity when it comes to their health. We eliminate
            the barrier between complex medical language and clear, simple
            explanations.
          </motion.h1>
          <motion.div variants={scaleUp}>
            <Image
              src={"/assets/study.jpg"}
              height={384}
              width={1248}
              className="rounded-xl mx-auto mt-8 sm:mt-16 shadow-2xl max-w-full h-auto"
              alt="Study image"
            />
          </motion.div>
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
            className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-8"
            variants={fadeInUp}
          >
            Our Goals
          </motion.h2>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Empowerment Through Knowledge */}
            <motion.div
              className="bg-white border border-gray-100 p-6 rounded-lg shadow-lg"
              variants={fadeInUp}
            >
              <h3 className="text-xl md:text-2xl font-semibold mb-4">
                Empowerment Through Knowledge
              </h3>
              <p className="text-gray-700 text-sm sm:text-base">
                We make complex medical information simple, giving users the
                clarity they need to take charge of their health.
              </p>
            </motion.div>

            {/* Compassionate Clarity */}
            <motion.div
              className="bg-white border border-gray-100 p-6 rounded-lg shadow-lg"
              variants={fadeInUp}
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">
                Compassionate Clarity
              </h3>
              <p className="text-gray-700 text-sm sm:text-base">
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
            className="text-3xl sm:text-4xl lg:text-6xl font-bold text-black mb-4"
            variants={fadeInUp}
          >
            Founder
          </motion.h2>
          <div className="mt-10 flex flex-col sm:flex-row justify-start items-stretch gap-8">
            {/* Image and Name Section */}
            <motion.div
              className="bg-transparent w-full sm:w-64 flex-none justify-start text-left mr-0 sm:mr-10"
              variants={scaleUp}
            >
              <Image
                src="/assets/portrait.png"
                width={256}
                height={256}
                className="rounded-lg mb-6 shadow-lg border border-gray-500"
                alt="Founder portrait"
              />
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-600 font-inter tracking-tighter">
                Joshua Souphanthong
              </h3>
            </motion.div>

            {/* Text Section */}
            <motion.div
              className="flex items-center sm:h-64"
              variants={fadeInUp}
            >
              <p className="text-base sm:text-xl text-gray-900 tracking-tighter font-inter">
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
