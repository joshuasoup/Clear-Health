"use client";
import Navbar from "./components/NavBar";
import "../styles/globals.css";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Footer from "./components/Footer";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const { user } = useUser();

  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();

  const { ref: ref1, inView: inView1 } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const { ref: ref2, inView: inView2 } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const { ref: ref3, inView: inView3 } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView1) {
      controls1.start({ opacity: 1, y: 0, transition: { duration: 0.8 } });
    } else {
      controls1.start({ opacity: 0, y: 100 });
    }
  }, [controls1, inView1]);

  useEffect(() => {
    if (inView2) {
      controls2.start({ opacity: 1, y: 0, transition: { duration: 0.8 } });
    } else {
      controls2.start({ opacity: 0, y: 100 });
    }
  }, [controls2, inView2]);

  useEffect(() => {
    if (inView3) {
      controls3.start({ opacity: 1, y: 0, transition: { duration: 0.8 } });
    } else {
      controls3.start({ opacity: 0, y: 100 });
    }
  }, [controls3, inView3]);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeOut", duration: 0.5 }}
      >
        {/* Hero Section */}
        <section className="mx-auto max-w-page flex flex-col items-center px-6 md:px-8 py-16 text-center h-fit">
          <h1
            className="font-inter lg:text-7xl sm:text-6xl text-5xl pt-5 font-semibold py-10 tracking-tighter max-w-4xl text-center leading-tight mx-auto md:px-8 "
            style={{ lineHeight: "1.2" }}
          >
            Medical reports made simple, so you can focus on your health.
          </h1>
          <p className="text-base md:text-lg text-neutral-500 mt-3 max-w-lg mx-auto">
            ClearHealth's AI-powered assistant will allow you to take control of
            your health and help you fully understand your medical condition.
          </p>
          <div className="mt-8">
            <Link
              href={user ? "/pdf-viewer" : "/sign-in"}
              className="special-button"
              style={{
                fontWeight: "400",
                fontSize: "19px",
                paddingLeft: "30px",
                paddingRight: "30px",
                paddingTop: "15px",
                paddingBottom: "15px",
                marginBottom: "15px",
              }}
            >
              Get Started Now
            </Link>
          </div>
        </section>

        {/* Dynamic Tooltips Section */}
        <motion.section
          className="max-w-page mx-auto flex flex-col lg:flex-row items-center px-6 md:px-16 py-16 space-y-12 lg:space-y-0 lg:space-x-8"
          ref={ref1}
          initial={{ opacity: 0, y: 100 }}
          animate={controls1}
        >
          {/* Video */}
          <div className="w-full lg:w-2/3 h-full">
            <video
              src="/assets/toolTipVideo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="rounded-lg w-full h-auto shadow-lg"
            />
          </div>

          {/* Text */}
          <div className="w-full lg:w-1/3 text-center lg:text-left space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Dynamic Tooltips for Quick Definitions
            </h2>
            <p className="text-base md:text-lg text-neutral-500">
              Hover over <span className="font-bold">complex</span> terms to
              reveal clear, concise definitions. Make sense of medical language
              in real-time, whether you're a{" "}
              <span className="font-bold">doctor</span>,{" "}
              <span className="font-bold">patient</span>, or{" "}
              <span className="font-bold">researcher</span>.
            </p>
          </div>
        </motion.section>

        {/* AI-Powered Medical Insights Section */}
        <motion.section
          className="max-w-page mx-auto flex flex-col lg:flex-row items-center px-6 md:px-16 py-16 space-y-12 lg:space-y-0 lg:space-x-8"
          ref={ref2}
          initial={{ opacity: 0, y: 100 }}
          animate={controls2}
        >
          {/* Text */}
          <div className="w-full lg:w-1/3 text-center lg:text-left space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold">
              AI-Powered Medical Insights
            </h2>
            <p className="text-base md:text-lg text-neutral-500">
              Harness the power of AI to break down medical jargon into simple,
              actionable insights. Easily interpret diagnoses, symptoms, and
              treatments without needing a medical degree.
            </p>
          </div>

          {/* Video */}
          <div className="w-full lg:w-2/3 h-full">
            <video
              src="/assets/explainToolTipVideo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="rounded-lg w-full h-auto shadow-lg"
            />
          </div>
        </motion.section>

        {/* Chatbot Section */}
        <motion.section
          className="max-w-page mx-auto flex flex-col lg:flex-row items-center px-6 md:px-16 py-16 space-y-12 lg:space-y-0 lg:space-x-8"
          ref={ref3}
          initial={{ opacity: 0, y: 100 }}
          animate={controls3}
        >
          {/* Video */}
          <div className="w-full lg:w-2/3 h-full">
            <video
              src="/assets/chatComponentVideo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="rounded-lg w-full h-auto shadow-lg"
            />
          </div>

          {/* Text */}
          <div className="w-full lg:w-1/3 text-center lg:text-left space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Chatbot with PDF Knowledge
            </h2>
            <p className="text-base md:text-lg text-neutral-500">
              Instantly get answers to your questions about specific medical
              reports. Our AI chatbot understands the context and content of
              each report, helping you navigate complex medical terminology with
              ease.
            </p>
          </div>
        </motion.section>
      </motion.div>
      <Footer />
    </div>
  );
};

export default Home;
