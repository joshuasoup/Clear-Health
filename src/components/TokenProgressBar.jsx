import React from "react";
import "../styles/token-bar.css";
import { useToken } from "../contexts/TokenContext";

const TokenProgressBar = () => {
  const { usedTokens, maxTokens, loading } = useToken();
  let percentage = (usedTokens / maxTokens) * 100;
  if (percentage > 100) {
    percentage = 100;
  }

  if (loading) {
    return null;
  }

  return (
    <div className="container p-1 bg-menu shadow-md">
      <div
        className="progressBar justify-center rounded-lg h-full"
        style={{ width: `${percentage}%` }}
      >
        <span className="label font-inter">
          {usedTokens} / {maxTokens} Tokens
        </span>
      </div>
    </div>
  );
};

export default TokenProgressBar;
