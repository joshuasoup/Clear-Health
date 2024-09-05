import React from "react";
import { useChat } from "ai/react";
import RightArrow from "../assets/1.png";
import Image from "next/image";
import defaultavatar from "../assets/avatar.png";
import "../styles/chat.css";

export default function ChatComponent({ callhandleClick }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  // Function to adjust the height of the textarea dynamically
  const adjustHeight = (element) => {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
    if (element.scrollHeight > parseInt(element.style.maxHeight)) {
      element.style.overflow = "auto";
    } else {
      element.style.overflow = "hidden";
    }
  };

  return (
    <div className="flex flex-col py-0 stretch h-full w-full justify-between border bg-menu px-4">
      <button
        onClick={callhandleClick}
        className="toggle-button hover:bg-gray-300 rounded-md mt-4 mb-2 w-full flex-row flex"
      >
        <Image src={RightArrow} alt="Next" width={30} height={30} />
      </button>
      <div className="flex flex-col flex-1 overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className="font-inter my-1 rounded-md text-sm flex items-start"
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
            className="resize-none w-full border-0 overflow-y-hidden bottom-0 align-middle p-0 focus:ring-transparent"
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
              overflow: "hidden",
              minHeight: "24px",
              maxHeight: "200px",
              boxSizing: "border-box",
              height: "auto", // Initial height set to minHeight
            }}
            rows="1"
            onInput={(e) => adjustHeight(e.target)}
          />
        </div>
      </form>
    </div>
  );
}
