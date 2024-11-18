"use client";
import "../styles/token-bar.css";
import { useToken } from "../contexts/TokenContext";
import { Tooltip } from "flowbite-react";
import React, { useEffect, useState } from "react";

const TokenProgressBar = ({ parentRef }) => {
  const { usedTokens, maxTokens, loading } = useToken();
  const [parentWidth, setParentWidth] = useState(0);
  const [color, setColor] = useState("");
  let percentage = (usedTokens / maxTokens) * 100;
  if (percentage > 100) {
    percentage = 100;
  }

  // Adjust percentage and set color based on different intervals
  useEffect(() => {
    if (percentage >= 75) {
      setColor("#ff1a00"); // Red color for high usage
    } else if (percentage >= 50) {
      setColor("#ffc107"); // Yellow color for medium usage
    } else {
      setColor("#4CAF50"); // Green color for low usage
    }
  }, [percentage]); // This effect depends on percentage

  useEffect(() => {
    const handleResize = () => {
      if (parentRef.current) {
        setParentWidth(parentRef.current.offsetWidth);
      }
    };

    if (parentRef.current) {
      handleResize();
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(parentRef.current);

      return () => {
        if (parentRef.current) {
          resizeObserver.unobserve(parentRef.current);
        }
      };
    }
  }, [parentRef]);

  return (
    <Tooltip
      content={`${usedTokens} / ${maxTokens} Tokens`}
      target="w-full"
      className="text-xs"
    >
      <div
        className="container p-1 bg-menu shadow-md"
        style={{ maxWidth: "550px", width: parentWidth }}
        data-tooltip-target="tooltip-animation"
      >
        <div
          className="progressBar justify-center rounded-lg h-full transition-all"
          style={{
            width: `${percentage}%`,
            zIndex: 40,
            backgroundColor: color,
          }}
        ></div>
      </div>
    </Tooltip>
  );
};

export default TokenProgressBar;
