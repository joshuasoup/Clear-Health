"use client";
import React, { createContext, useContext, useState } from "react";

const SubscriptionContext = createContext(null);

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);

  const loadSubscription = async (userId) => {};

  return (
    <SubscriptionContext.Provider value={{ subscription, loadSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
