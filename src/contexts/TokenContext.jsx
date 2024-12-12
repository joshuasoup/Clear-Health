"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const TokenContext = createContext();

export const useToken = () => {
  return useContext(TokenContext);
};

export const TokenProvider = ({ children }) => {
  const [usedTokens, setUsedTokens] = useState(0);
  const [maxTokens, setMaxTokens] = useState(500); // Default value
  const [loading, setLoading] = useState(true);

  const fetchTokenUsage = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-token-usage");
      const text = await response.text(); // Fetch raw response as text
      console.log("Raw response:", text);

      // Safely parse the text as JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Invalid JSON received:", text);
        throw new Error("Invalid JSON response from server");
      }

      if (response.ok) {
        setUsedTokens(data?.usedTokens || 0); // Use default if missing
        setMaxTokens(data?.maxTokens || 500); // Use default if missing
      } else {
        console.error("API Error:", data?.error || "Unknown error");
      }
    } catch (error) {
      console.error("Failed to fetch token usage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokenUsage();
  }, [fetchTokenUsage]);

  return (
    <TokenContext.Provider
      value={{ usedTokens, maxTokens, fetchTokenUsage, loading }}
    >
      {children}
    </TokenContext.Provider>
  );
};
