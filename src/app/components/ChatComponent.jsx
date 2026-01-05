import React, { useEffect, useRef } from "react";
import { useChat } from "ai/react";
import RightArrow from "../../assets/images/1.png";
import RefreshLogo from "../../assets/images/3.png";
import Image from "next/image";
import defaultavatar from "../../assets/images/avatar.png";
import "../../styles/chat.css";
import logo from "../../assets/images/clearhealthlogo.png";

export default function ChatComponent({ callhandleClick, fileKey }) {
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      api: "/api/chat",
      body: {
        fileKey,
      },
    });
  const chatContainerRef = useRef(null); // Ref to the chat container

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

  // Scroll to the bottom whenever messages change
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }, 90);
    }
  };

  const refreshChat = () => {
    localStorage.removeItem("chatMessages");
    setMessages("");
  };

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages)); // Load saved messages
    }
  }, [setMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages)); // Save messages
      scrollToBottom(); // Scroll to the bottom when new messages arrive
    }
  }, [messages]);

  return (
    <div className="chat-panel flex flex-col py-0 stretch h-full w-full justify-between border bg-menu px-4 text-[13px] leading-relaxed">
      <div className="flex flex-row justify-between">
        <button
          onClick={callhandleClick}
          className="toggle-button hover:bg-gray-200 rounded-md mt-4 mb-2 transform transition-transform duration-300 hover:scale-110"
        >
          <Image src={RightArrow} alt="Next" width={35} height={35} />
        </button>
        <button
          onClick={refreshChat}
          className="transform transition-transform duration-300 hover:scale-110 toggle-button"
        >
          <Image
            src={RefreshLogo}
            width={35}
            height={35}
            className="mt-4 mb-2 rounded-md hover:bg-gray-200"
            alt="Clear Chat"
          />
        </button>
      </div>

      {/* Add ref to the chat container */}
      <div
        className="flex flex-col flex-1 overflow-y-auto"
        ref={chatContainerRef}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className="my-1 rounded-md flex items-start"
          >
            <div className="bg-transparent mr-1">
              {m.role === "user" ? (
                <Image
                  src={defaultavatar}
                  alt="User Icon"
                  style={{ minWidth: "30px", maxWidth: "30px" }}
                  className="rounded-full mt-1"
                />
              ) : (
                <Image
                  src={logo}
                  alt="Other Icon"
                  style={{ minWidth: "30px", maxWidth: "30px" }}
                  className="mt-1"
                />
              )}
            </div>
            {m.role === "user" ? (
              <div
                className="message-bubble bg-userchat rounded-md py-3 px-3 flex-1 text-left"
                style={{ minWidth: "280px", minHeight: "44px" }}
              >
                {m.content}
              </div>
            ) : (
              <div
                className="message-bubble bg-white rounded-md py-3 px-3 flex-1 text-left"
                style={{ minWidth: "280px", minHeight: "44px" }}
              >
                {m.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="bg-white rounded-md px-4 py-3 shadow-md bottom-0">
          <textarea
            className="resize-none w-full border-0 overflow-y-hidden bottom-0 align-middle p-0 focus:ring-transparent text-[13px] leading-relaxed"
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
