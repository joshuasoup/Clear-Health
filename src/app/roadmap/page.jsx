"use client";
import React from "react";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { FaRocket, FaLightbulb, FaCogs } from "react-icons/fa";
import { useEffect } from "react";

const roadmapItems = [
  {
    title: "Connecting You to the Right Care",
    description:
      "We aim to add features that will provide personalized recommendations for top-rated doctors, specialized hospitals, and supportive groups tailored to your specific condition. We're committed to bridging the gap between understanding your health and finding the care you deserve.",
    icon: <FaRocket className="text-blue-500" size={40} />,
  },
  {
    title: "Uniting Voices, Sharing Stories",
    description:
      "We want to connect you with others who have walked a similar path. Access blogs, personal stories, and reach out to individuals who truly understand your experience. By fostering a community of shared insights and support, we're turning solitary journeys into collective strength.",
    icon: <FaLightbulb className="text-yellow-500" size={40} />,
  },
  {
    title: "Health Empowerment for Everyone",
    description:
      "Our ultimate goal is to open our platform to everyone, making it intuitive and user-friendly regardless of technical ability. We're dedicated to breaking down barriers so that every individual can take control of their health narrative, understand their medical reports, and access the support they need—all in one place.",
    icon: <FaCogs className="text-green-500" size={40} />,
  },
];

const page = () => {
  useEffect(() => {
    document.title = "The Future of Clear Health";
  }, []);
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <div className="font-inter max-w-4xl mx-auto py-12 px-4">
          <h1 className="text-7xl font-bold mb-16 tracking-tighter text-left">
            Next Steps...
          </h1>
          <div className="space-y-16">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 shadow-lg rounded-lg p-12 flex items-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                  delay: index * 0.2,
                }}
                viewport={{ once: true, amount: 0.8 }}
              >
                <div className="mr-6">{item.icon}</div>
                <div>
                  <h2 className="text-3xl font-semibold mb-4">{item.title}</h2>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
