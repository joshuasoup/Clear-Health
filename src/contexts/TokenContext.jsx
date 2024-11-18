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
  const [maxTokens, setMaxTokens] = useState(500); // Default value, you can adjust as needed
  const [loading, setLoading] = useState(true);

  const fetchTokenUsage = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-token-usage");
      const data = await response.json();

      if (response.ok) {
        setUsedTokens(data.usedTokens);
        // setMaxTokens(data.maxTokens);
      } else {
        console.error(data.error);
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
