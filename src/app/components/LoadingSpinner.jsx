import React from "react";
import { motion } from "framer-motion";

const dotVariants = {
  jump: (i) => ({
    y: [0, -20, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 1,
      delay: i * 0.1, // Staggering effect
    },
  }),
};

const LoadingSpinner = ({
  color = "#e91e27", // Default color
  size = 20, // Default size of the dots
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full viewport height
      }}
    >
      <div style={{ display: "flex", gap: size / 2 }}>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="dot"
            custom={i}
            variants={dotVariants}
            animate="jump"
            style={{
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: color,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
