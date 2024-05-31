"use client";
import React, { useState, useEffect } from "react";
import { useChat } from "ai/react";
import RightArrow from "../assets/1.png";
import Image from "next/image";
import defaultavatar from "../assets/avatar.png";
import logo from "../assets/medical-logo.png";
import "../styles/chat.css";

export default function ChatComponent({ callhandleClick }) {
  const adjustHeight = (element) => {
    const originHeight = element.target.style.height;
    // element.style.height = element.style.minHeight;
    // element.style.height = "auto";
    const scrollHeight = element.target.scrollHeight;

    const maxHeight = parseInt(
      window.getComputedStyle(element.target).maxHeight
    );
    console.log(scrollHeight);

    // Calculate the new height based on the content
    const newHeight = Math.min(scrollHeight, maxHeight);

    // Set the new height
    element.target.style.height = `${newHeight}px`;

    // Optional: Scroll to the bottom if needed
    element.target.scrollTop = element.target.scrollHeight;
  };

  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col py-0 stretch h-full w-full justify-between border bg-menu px-4">
      <button
        onClick={callhandleClick}
        class="toggle-button hover:bg-gray-300 rounded-md mt-4 mb-2 w-full flex-row flex"
      >
        <Image src={RightArrow} alt="Next" width={30} height={30} />
      </button>
      <div className="flex flex-col flex-1 overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className="font-inter my-1 rounded-md text-sm flex items-start "
          >
            <div className="bg-transparent mr-1">
              {m.role === "user" ? (
                <Image
                  src={defaultavatar}
                  alt="User Icon"
                  style={{ width: "30px" }}
                  className="rounded-full mt-1"
                />
              ) : (
                <Image
                  src={logo}
                  alt="Other Icon"
                  style={{ width: "30px" }}
                  className="mt-1"
                />
              )}
            </div>
            <div className="bg-white rounded-md py-3 px-3 flex-1 text-left">
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="bg-white rounded-md px-4 py-3 shadow-md bottom-0">
          <textarea
            className="resize-none w-full border-0 overflow-y-hidden bottom-0 align-middle p-0"
            value={input}
            placeholder="Ask Anything..."
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // Prevent the default behavior of adding a new line
                handleSubmit(e); // Call the submit function
              }
            }}
            style={{
              overflow: "auto",
              minHeight: "24px",
              maxHeight: "200px",
              boxSizing: "border-box",
              height: "24px",
            }}
            onInput={(e) => {
              adjustHeight(e);
            }}
          />
        </div>
      </form>
    </div>
  );
}