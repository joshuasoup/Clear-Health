import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
const FeatureItem = ({ text }) => (
  <div className="flex items-center gap-3 my-3">
    <svg
      className="text-red w-4 h-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="3"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
    <span className="text-gray-700 text-lg">{text}</span>
  </div>
);

const PricingCatalog = () => {
  const router = useRouter();
  const { user } = useUser();

  const handleButtonClick = async () => {
    if (user) {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const session = await response.json();
      window.location.href = session.url;
    } else {
      router.push("/sign-in");
    }
  };

  const handleFreeClick = () => {
    if (user) {
      router.push("/pdf-viewer");
    } else {
      router.push("/sign-in");
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex flex-col gap-2 md:flex-row">
      {/* Free Plan Card */}
      <motion.div
        className="bg-white rounded-md shadow-xl py-8 px-8 flex flex-col w-catalog border items-start justify-between"
        style={{ height: "100%" }}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <div>
          <div className="left-0 text-left">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 ml-1">
              Free
            </h2>
            <p className="text-6xl font-medium text-gray-900">
              $0
              <span className="text-xl text-gray-500 font-medium">/month</span>
            </p>
          </div>
          <div className="mt-6 mb-3 text-left">
            <FeatureItem text="3 PDF Limit" />
            <FeatureItem text="AI Summaries" />
            <FeatureItem text="AI Response Limit" />
            <FeatureItem text="AI Chat" />
          </div>
        </div>
        <button
          className="bg-white hover:bg-slate-100 border font-normal px-8 h-12 rounded-md transition duration-300 w-full bottom-0 mt-4"
          onClick={handleFreeClick}
          whileHover="hover"
        >
          Try Now
        </button>
      </motion.div>

      {/* Unlimited Plan Card */}
      <motion.div
        className="bg-white rounded-md shadow-xl py-8 px-8 flex flex-col w-catalog border items-start justify-between"
        style={{ height: "100%" }}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <div>
          <div className="left-0 text-left">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 ml-1">
              Unlimited
            </h2>
            <p className="text-6xl font-medium text-gray-900">
              $9
              <span className="text-xl text-gray-500 font-medium">/month</span>
            </p>
          </div>
          <div className="mt-6 mb-3 text-left">
            <FeatureItem text="Unlimited Document Handling" />
            <FeatureItem text="Learning Mode" />
            <FeatureItem text="AI Summaries" />
            <FeatureItem text="Unlimited Questions" />
            <FeatureItem text="Focused Support" />
            <FeatureItem text="Latest Features" />
            <FeatureItem text="AI Chat" />
          </div>
        </div>
        <button
          className="bg-red hover:bg-rose-600 text-white font-normal px-8 h-12 rounded-md transition duration-300 w-full mt-4"
          onClick={handleButtonClick}
          whileHover="hover"
        >
          Subscribe
        </button>
      </motion.div>
    </div>
  );
};

export default PricingCatalog;
