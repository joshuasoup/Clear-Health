"use client";
import Navbar from "../components/NavBar";
import "../styles/globals.css";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Footer from "../components/Footer";
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
    <div className="h-screen">
      <Navbar />
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeOut", duration: 0.5 }}
      >
        <section className="w-full h-hero flex-center flex-col items-center flex align-middle px-8">
          <div className="max-w-page">
            <h1
              className="font-inter lg:text-7xl sm:text-6xl text-5xl pt-20 font-semibold py-10 tracking-tighter max-w-4xl text-center leading-tight mx-auto px-8"
              style={{ lineHeight: "1.2" }}
            >
              Medical reports made simple, so you can focus on your health.
            </h1>
            <p className="max-w-lg text-center mx-auto leading-7 font-inter text-neutral-500 text-lg">
              ClearHealth's AI-powered assistant will allow you to take control
              of your health and help you fully understand your medical
              condition
            </p>
            <div className="py-10">
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
                }}
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </section>

        {/* Dynamic Tooltips for Quick Definitions Section */}
        <motion.section
          className="w-full flex flex-row justify-center items-center py-16 min-h-hero px-20"
          ref={ref1}
          initial={{ opacity: 0, y: 100 }}
          animate={controls1}
        >
          {/* Video on the left */}
          <div className="max-w-page flex flex-col lg:flex-row justify-center lg:justify-between items-center lg:items-stretch lg:space-x-8">
            {/* Video Section */}
            <div className="w-full lg:w-2/3 lg:h-full px-8 flex justify-center items-center h-full">
              <video
                src="/assets/toolTipVideo.mp4"
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                preload="auto"
                style={{
                  cursor: "auto",
                  width: "100%",
                  height: "100%",
                  borderRadius: "12px",
                  display: "block",
                  objectFit: "cover",
                  backgroundColor: "rgba(0, 0, 0, 0)",
                  objectPosition: "50% 50%",
                }}
                className="shadow-2xl"
              >
                <track
                  src="/assets/captions.vtt"
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Text Section */}
            <div className="w-full lg:w-1/3 text-center mt-8 lg:text-left px-8 flex flex-col justify-center">
              <h2 className="text-3xl font-semibold mb-4">
                Dynamic Tooltips for Quick Definitions
              </h2>
              <p className="text-lg text-neutral-500">
                Hover over <span className="font-bold">complex</span> terms to
                reveal clear, concise definitions. Make sense of medical
                language in real-time, whether you're a{" "}
                <span className="font-bold">doctor</span>,{" "}
                <span className="font-bold">patient</span>, or{" "}
                <span className="font-bold">researcher</span>.
              </p>
              {/* Example Tooltip */}
              <p className="mt-6">
                Here's an example of a term with a tooltip:{" "}
                <span className="relative group cursor-pointer text-blue-500">
                  Hemoglobin
                  <span className="absolute left-0 w-48 p-2 mt-6 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    A protein in red blood cells that carries oxygen throughout
                    the body.
                  </span>
                </span>
              </p>
            </div>
          </div>
        </motion.section>

        {/* AI-Powered Medical Insights Section */}
        <motion.section
          className="w-full flex flex-row justify-center items-center py-16 min-h-hero px-20"
          ref={ref2}
          initial={{ opacity: 0, y: 100 }}
          animate={controls2}
        >
          {/* Insights text on the left */}
          <div className="max-w-page flex flex-col lg:flex-row justify-center lg:justify-between items-center lg:items-stretch lg:space-x-8">
            <div className="w-full lg:w-1/3 text-center mb-8 lg:text-left px-8 flex flex-col justify-center">
              <h2 className="text-3xl font-semibold mb-4">
                AI-Powered Medical Insights
              </h2>
              <p className="text-lg text-neutral-500">
                Harness the power of AI to break down medical jargon into
                simple, actionable insights. Easily interpret diagnoses,
                symptoms, and treatments without needing a medical degree.
              </p>
            </div>

            {/* Video */}
            <div className="w-full lg:w-2/3 px-8">
              <video
                src="/assets/explainToolTipVideo.mp4"
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                preload="auto"
                style={{
                  cursor: "auto",
                  width: "100%",
                  height: "100%",
                  borderRadius: "12px",
                  display: "block",
                  objectFit: "cover",
                  backgroundColor: "rgba(0, 0, 0, 0)",
                  objectPosition: "50% 50%",
                }}
                className="shadow-2xl"
              >
                <track
                  src="/assets/captions.vtt"
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </motion.section>

        {/* Chatbot section */}
        <motion.section
          ref={ref3}
          className="w-full flex flex-row justify-center items-center py-16 min-h-hero px-20"
          initial={{ opacity: 0, y: 100 }} // Starting state (hidden and shifted left)
          animate={controls3} // Controls the animation when in view
        >
          {/* Video on the left */}
          <div className="max-w-page flex flex-col lg:flex-row justify-center lg:justify-between items-center lg:items-stretch lg:space-x-8">
            {/* Video Section */}
            <div className="w-full lg:w-2/3 lg:h-full px-8 flex justify-center items-center h-full">
              <motion.video
                src="/assets/chatComponentVideo.mp4"
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                preload="auto"
                style={{
                  cursor: "auto",
                  width: "100%",
                  height: "100%",
                  borderRadius: "12px",
                  display: "block",
                  objectFit: "cover",
                  backgroundColor: "rgba(0, 0, 0, 0)",
                  objectPosition: "50% 50%",
                }}
                className="shadow-2xl"
              >
                <track
                  src="/assets/captions.vtt"
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                />
                Your browser does not support the video tag.
              </motion.video>
            </div>

            {/* Text Section */}
            <div className="w-full lg:w-1/3 text-center mt-8 lg:text-left px-8 flex flex-col justify-center">
              <h2 className="text-3xl font-semibold mb-4">
                Chatbot with PDF Knowledge
              </h2>
              <p className="text-lg text-neutral-500">
                Instantly get answers to your questions about specific medical
                reports. Our AI chatbot understands the context and content of
                each report, helping you navigate complex medical terminology
                with ease.
              </p>
            </div>
          </div>
        </motion.section>
      </motion.div>
      <Footer />
    </div>
  );
};

export default Home;
