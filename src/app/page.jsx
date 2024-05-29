"use client";
import Navbar from "../components/NavBar";
import { SignOutButton } from "@clerk/nextjs";
import "../styles/globals.css";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div>
      <Navbar />
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeOut", duration: 1 }}
      >
        <section className="w-full flex-center flex-col">
          <h1 className="font-inter text-6xl pt-20 font-semibold py-10 tracking-tighter max-w-4xl text-center mx-auto px-8">
            Learn to read medical reports on your own
          </h1>
          <p className="max-w-lg text-center mx-auto leading-7 font-inter text-neutral-500 text-lg">
            With medi-s assistance you'll be able to comprehend, understand, and
            learn about each and every report
          </p>
        </section>
      </motion.div>
    </div>
  );
};

export default Home;
