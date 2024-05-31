"use client";
import React, { useState, useEffect, useRef } from "react";
import UploadButton from "../../components/UploadButton";
import dynamic from "next/dynamic";
import "../../styles/globals.css";
import "../../styles/viewer.css";
import UserMenu from "../../components/UserMenu";
import Link from "next/link";
import Image from "next/image";
import medicalLogo from "../../assets/mock up logo (2).png";
import PricingCatalog from "../../components/PricingCatalog";
import { motion } from "framer-motion";
import sidebar from "../../assets/1.png";
import ChatComponent from "../../components/ChatComponent";
import garbagecan from "../../assets/garbagecan.png";
import pencil from "../../assets/pencil.png";
import DeleteButton from "../../components/DeleteButton";

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
  const dynamicWidth = userWidth ?? (showComponent ? "400px" : "0px");
  const [activeItemKey, setActiveItemKey] = useState(null);
  const [renamingKey, setRenamingKey] = useState(null);
  const [newName, setNewName] = useState("");

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
    const url = "/api/rename"; // Adjust the URL to match your API route
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
        setSelectedTitle(name);
        console.log(data.presignedUrl);
        setSelectedPdfUrl(data.presignedUrl);
        toggleActive(key);
      })

      .catch((error) => {
        console.error("Error fetching pre-signed URL:", error);
      });
  }

  const handleUpgradeClick = () => {
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleClick = () => {
    setShowComponent(!showComponent);
    setIsOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "unset";
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!showComponent) {
      setUserWidth(null); // Resets the user-set width when the component is not shown
    }
  }, [showComponent]);

  useEffect(() => {
    async function fetchPDFs() {
      try {
        const response = await fetch("/api/files");
        if (!response.ok) throw new Error("Network response was not ok.");
        const data = await response.json();
        setPDFs(data.pdfs);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchPDFs();
  }, [submissionCount]);

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
          } transition-all duration-500 ease-in-out p-3 overflow-y-auto  flex flex-col h-full`}
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
                    <span className="text-xl font-inter  text-slate-800">
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
              <UploadButton handleAction={handleAction} />
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
                <div></div>
              </div>
              <hr className="m-3" />
              <UserMenu />
              {/* <button
                className="special-button mt-2"
                onClick={handleUpgradeClick}
              >
                Upgrade
              </button> */}
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
        <div className="flex-7 mx-2 flex-col h-screen my-0 overflow-auto flex">
          {/* top menubar */}
          <header className="p-3 h-16 flex justify-between items-center sticky top-0 left-0 bg-white z-10 h-max-pdfbar">
            <h1>{title}</h1>
            <div className="flex">
              {/* <button
                className="special-button w-115"
                onClick={handleUpgradeClick}
              >
                Upgrade
              </button> */}
              {modalOpen && (
                <div>
                  <div className="modal-background">
                    <motion.div
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ ease: "easeOut", duration: 0.5 }}
                      className="modal-content w-200"
                    >
                      <PricingCatalog />
                      <button onClick={handleCloseModal}>Close</button>
                    </motion.div>
                  </div>
                </div>
              )}
              {!showComponent && (
                <button className="button mr-0" onClick={handleClick}>
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
          <PDFLoader pdfUrl={selectedPdfUrl} />
        </div>

        <div
          className={`relative transition-width duration-500 overflow-hidden`}
          ref={containerRef}
          style={{
            width: dynamicWidth,
            maxWidth: "725px",
            minWidth: showComponent ? "400px" : "0px",
            // Removed minWidth and maxWidth for clarity in this example
          }}
        >
          {showComponent && (
            <>
              <ChatComponent callhandleClick={handleClick} />
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
