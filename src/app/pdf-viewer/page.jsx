"use client";
import React, { useState, useEffect, useRef } from "react";
import UploadButton from "../../components/UploadButton";
import dynamic from "next/dynamic";
import "../../styles/globals.css";
import "../../styles/viewer.css";
import UserMenu from "../../components/UserMenu";
import Link from "next/link";
import Image from "next/image";
import medicalLogo from "../../assets/images/clearhealthlogo.png";
import PricingCatalog from "../../components/PricingCatalog";
import { motion } from "framer-motion";
import sidebar from "../../assets/images/1.png";
import ChatComponent from "../../components/ChatComponent";
import pencil from "../../assets/images/pencil.png";
import DeleteButton from "../../components/DeleteButton";
import TokenProgressBar from "../../components/TokenProgressBar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";
import message from "../../assets/images/chatsymbol.png";

const PDFLoader = dynamic(() => import("../../components/PDFLoader"), {
  ssr: false,
});

const checkSubscriptionStatus = async (userId) => {
  const user = await subscriptions.findOne({ clerkUserId: userId });

  if (!user || !user.subscription) {
    return { active: false };
  }

  const now = new Date();
  if (
    user.subscription.status === "active" &&
    user.subscription.currentPeriodEnd > now
  ) {
    return { active: true };
  } else {
    return { active: false };
  }
};

export default function Viewer() {
  const [PDFs, setPDFs] = useState([]);
  const [error, setError] = useState(null);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [title, setSelectedTitle] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [showComponent, setShowComponent] = useState(false);
  const [userWidth, setUserWidth] = useState(null);
  const containerRef = useRef(null);
  const dynamicWidth = userWidth ?? (showComponent ? "350px" : "0px");
  const [activeItemKey, setActiveItemKey] = useState(null);
  const [renamingKey, setRenamingKey] = useState(null);
  const [currentFileKey, setCurrentFileKey] = useState(null);
  const [newName, setNewName] = useState("");
  const parentRef = useRef(null);
  const [isSubscribed, setIsSubscribed] = useState(false); //remove later temporary
  const { user } = useUser();
  const router = useRouter();
  const [showUserProfile, setShowUserProfile] = useState(false);

  useEffect(() => {
    if (!showComponent) {
      setUserWidth(null); // Resets the user-set width when the component is not shown
    }
  }, [showComponent]);

  useEffect(() => {
    async function fetchPDFs() {
      try {
        setSelectedTitle("Loading...");
        const response = await fetch("/api/get-pdf");
        if (!response.ok) throw new Error("Network response was not ok.");
        const data = await response.json();
        setPDFs(data.userCollection);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchPDFs();
  }, [submissionCount]);

  if (!user) {
    return <LoadingSpinner />;
  }

  const toggleUserProfile = () => {
    setShowUserProfile((prev) => !prev);
  };

  const startRenaming = (key, currentName) => {
    setRenamingKey(key);
    setNewName("");
  };

  const upSubmission = () => {
    setSubmissionCount(submissionCount + 1);
  };
  const handleRenameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleOffClick = () => {
    setRenamingKey(null);
  };

  const submitRename = async (key, newName) => {
    const url = "/api/rename-pdf";
    const body = JSON.stringify({ fileId: key, newName });
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include other headers as needed, e.g., for authentication
        },
        body: body,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update file name: ${errorMessage}`);
      }

      const data = await response.json();
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`); // Provide user feedback
    } finally {
      setSubmissionCount(submissionCount + 1);
      setSelectedTitle(newName);
      setRenamingKey(null); // Reset renamingKey to exit renaming mode regardless of outcome
    }
  };

  const startResizing = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = containerRef.current.getBoundingClientRect().width;

    const handleMouseMove = (moveEvent) => {
      const dx = startX - moveEvent.clientX;
      const newWidth = startWidth + dx;
      setUserWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  function handleAction(name, key) {
    console.log(`${name} executed with URL: ${key}`);
    setSubmissionCount(submissionCount + 1);
    fetch(`/api/presigned-url?key=${encodeURIComponent(key)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setSelectedPdfUrl(data.presignedUrl);
        toggleActive(key);
        setCurrentFileKey(key);
        setSelectedTitle(name);
      })

      .catch((error) => {
        console.error("Error fetching pre-signed URL:", error);
      });
  }

  const handleClick = () => {
    setShowComponent(!showComponent);
  };

  const openChat = () => {
    setShowComponent(!showComponent);
    setIsOpen(false);
  };

  const toggleUpgradeModal = () => {
    setModalOpen((prev) => !prev);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleActive = (key) => {
    if (activeItemKey === key) {
      setActiveItemKey(null); // Deactivate if the same key is clicked again
    } else {
      setActiveItemKey(key); // Set new key as active
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      {modalOpen && (
        <div className="modal-background w-screen h-screen z-50">
          <button
            className="absolute top-4 right-6 text-white font-semibold text-3xl hover:text-slate-300"
            onClick={toggleUpgradeModal}
          >
            &times;
          </button>

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeOut", duration: 0.5 }}
            className="modal-content w-200"
          >
            <PricingCatalog />
          </motion.div>
        </div>
      )}
      {showUserProfile && (
        <div>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }} // Start with 0 opacity
            animate={{ opacity: 1 }} // Animate to full opacity
            exit={{ opacity: 0 }} // Animate to 0 opacity when closing
            onClick={toggleUserProfile}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ scale: 0.5, opacity: 0 }} // Start small and transparent
            animate={{ scale: 1, opacity: 1 }} // Animate to full size and opacity
            exit={{ scale: 0.5, opacity: 0 }} // Shrink when closing
            transition={{ duration: 0.3, ease: "easeInOut" }} // Control timing
          >
            {/* Your UserProfile component or other content here */}
            <UserProfile routing="hash" />
          </motion.div>
          <button
            className="absolute top-4 right-6 text-white font-semibold text-3xl hover:text-slate-300 z-50"
            onClick={toggleUserProfile}
          >
            &times;
          </button>
        </div>
      )}
      {/* Content Area */}
      <div
        className={`flex ${isOpen ? "overflow-hidden" : ""} overflow-hidden`}
      >
        {/* Sidebar for PDFs */}
        <div
          className={`relative ${
            isOpen
              ? "bg-menu border-slate-200 border shadow-md flex-1 min-w-menu overflow-x-hidden"
              : "bg-transparent border-transparent shadow-none w-12 min-w-12"
          } transition-all duration-500 ease-in-out p-3 overflow-y-auto flex flex-col h-full whitespace-nowrap`}
        >
          {isOpen && (
            <>
              <div className="flex justify-between items-center">
                <Link href="/">
                  <div className="company-name py-1 flex items-center">
                    <Image
                      src={medicalLogo}
                      alt="Logo"
                      width={35}
                      height={35}
                      className="pr-2"
                    />
                    <span className="text-xl font-inter tracking-tighter  text-slate-800">
                      Clear Health
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className={`hover:bg-hover rounded-md flex items-center justify-center mr-2 rotate-180
                  `}
                  style={{ width: "30px", height: "30px" }} // Ensure fixed size
                >
                  <Image src={sidebar} alt="Logo" width={30} height={30} />
                </button>
              </div>

              <div>
                <p className="mt-4 mb-3 text-gray-400 size-3 px-2 font-medium text-sm">
                  Documents
                </p>
              </div>
              <UploadButton
                handleAction={handleAction}
                toggleUpgradeModal={toggleUpgradeModal}
              />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <ul>
                  {PDFs.map((pdf) => (
                    <li key={pdf._id} className="mb-4">
                      {pdf.pdfs
                        .slice()
                        .reverse()
                        .map((obj) => (
                          <div
                            className={`group relative flex justify-between items-center w-full overflow-hidden rounded-md ${
                              activeItemKey === obj.key
                                ? "bg-hover"
                                : "hover:bg-hover"
                            }`}
                          >
                            {renamingKey === obj.key ? (
                              <input
                                type="text"
                                value={newName}
                                onChange={handleRenameChange}
                                onBlur={handleOffClick}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter") {
                                    submitRename(obj.key, newName);
                                  }
                                }}
                                className="bg-hover rounded-md font-inter text-sm font-sm border w-full"
                                autoFocus
                              />
                            ) : (
                              <button
                                className="relative block text-left bg-transparent border-gray-300 px-2 py-3 font-inter text-sm font-sm whitespace-nowrap overflow-hidden w-full"
                                onClick={() => handleAction(obj.name, obj.key)}
                                title={obj.name}
                                style={{ maxWidth: "100%" }}
                              >
                                <div className="flex items-center">
                                  <div className="truncate overflow-hidden text-ellipsis whitespace-nowrap">
                                    {obj.name}
                                  </div>
                                </div>
                              </button>
                            )}

                            {renamingKey !== obj.key && (
                              <div
                                className={`mr-3 flex-shrink-0 ${
                                  activeItemKey === obj.key
                                    ? "flex"
                                    : "hidden group-hover:flex"
                                } align-middle gap-x-1 transition-transform duration-200`}
                              >
                                <button
                                  onClick={() =>
                                    startRenaming(obj.key, obj.name)
                                  }
                                  className="ml-1 transform hover:scale-110 duration-200"
                                >
                                  <Image
                                    src={pencil}
                                    alt="Pencil"
                                    width={15}
                                    height={15}
                                  />
                                </button>
                                <DeleteButton
                                  fileKey={obj.key}
                                  upSubmission={upSubmission}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                    </li>
                  ))}
                </ul>
              </div>
              <hr className="m-3" />
              <UserMenu
                onProfileClick={toggleUserProfile}
                onUpgradeClick={toggleUpgradeModal}
              />
              {!isSubscribed && (
                <button
                  className="special-button mt-2"
                  onClick={toggleUpgradeModal}
                >
                  Upgrade
                </button>
              )}
            </>
          )}
          <button
            onClick={toggleSidebar}
            className={` absolute top-4 ${
              isOpen
                ? " -translate-x-96 "
                : "translate-x-0 transition-transform duration-300 ease-in-out"
            }  z-10 flex items-center justify-center w-8 h-8 toggle-button hover:bg-hover rounded-md`}
          >
            <Image src={sidebar} alt="Logo" width={30} height={30} />
          </button>
        </div>

        {/* Main content area for the PDF viewer */}
        <div className="flex-7 mx-2 flex-col h-screen my-0 overflow-auto flex ">
          {/* top menubar */}
          <header className="p-3 flex justify-between items-center sticky top-0 left-0 bg-white z-10 max-h-pdfbar min-h-pdfbar font-inter">
            <h1>{title}</h1>
            <div className="flex">
              {!showComponent && (
                <button
                  className="button text-gray-500 mr-0 font-semibold flex flex-row items-center"
                  onClick={openChat}
                >
                  <Image
                    src={message}
                    width={18}
                    className="mr-2"
                    alt="Chat Button"
                  />
                  Chat
                </button>
              )}

              <button className="text-white ml-0">
                <i className="settings-icon"></i>{" "}
                {/* Replace with actual settings icon */}
              </button>
              <button className="text-white">
                <i className="chat-icon"></i>{" "}
                {/* Replace with actual chat icon */}
              </button>
              <button className="text-white">
                <i className="library-icon"></i>{" "}
                {/* Replace with actual library icon */}
              </button>
            </div>
          </header>
          <PDFLoader
            pdfUrl={selectedPdfUrl}
            toggleUpgradeModal={toggleUpgradeModal}
            className="z-20"
          />
          <div
            className="rounded-md bg-slate-100 w-1/2 sticky bottom-5 m-auto min-w-44 z-6"
            style={{ maxWidth: "550px" }}
            ref={parentRef}
          >
            <TokenProgressBar parentRef={parentRef} />
          </div>
        </div>

        <div
          className={`relative transition-width duration-500 overflow-hidden`}
          ref={containerRef}
          style={{
            width: dynamicWidth,
            maxWidth: "725px",
            minWidth: showComponent ? "350px" : "0px",
            // Removed minWidth and maxWidth for clarity in this example
          }}
        >
          {showComponent && (
            <>
              <ChatComponent
                callhandleClick={handleClick}
                fileKey={currentFileKey}
              />
              <div
                onMouseDown={startResizing}
                style={{
                  cursor: "ew-resize",
                  width: "10px",
                  height: "100%",
                  position: "absolute",
                  left: "0",
                  top: "0",
                  zIndex: 10, // Make sure this is above other content for mouse events
                  backgroundColor: "transparent", // or any color for visibility
                }}
              ></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
