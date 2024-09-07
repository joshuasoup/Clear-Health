"use client";
import Navbar from "../components/NavBar";
import { SignOutButton } from "@clerk/nextjs";
import "../styles/globals.css";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const Home = () => {
  const { user } = useUser();

  return (
    <div className="h-screen ">
      <Navbar />
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeOut", duration: 0.5 }}
      >
        <section className="w-full flex-center flex-col">
          <h1
            className="font-inter text-6xl pt-20 font-semibold py-10 tracking-tighter max-w-4xl text-center mx-auto px-8"
            style={{ lineHeight: "1.2" }}
          >
            Learn to read medical reports on your own
          </h1>
          <p className="max-w-lg text-center mx-auto leading-7 font-inter text-neutral-500 text-lg">
            ClearHealth's AI-powered assistant will allow you to take control of
            your health and help you fully understand your medical condition
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
        </section>
      </motion.div>
    </div>
  );
};

export default Home;
