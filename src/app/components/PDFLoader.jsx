import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Image from "next/image";
import RightArrow from "../../assets/images/1.png";
import LeftArrow from "../../assets/images/2.png";
import medicalLogo from "../../assets/images/clearhealthlogo.png";
import Link from "next/link";
import "../../../node_modules/react-pdf/dist/esm/Page/TextLayer.css";
import "../../../node_modules/react-pdf/dist/esm/Page/AnnotationLayer.css";
import "../../styles/globals.css";
import ToolTip from "./ToolTip";
import { motion } from "framer-motion";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const typingVariants = {
  hidden: { width: 0 },
  visible: {
    width: "100%",
    transition: {
      duration: 2.5, // Slightly longer duration
      ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for a more natural feel
      delay: 0.2, // Slight delay before starting
      times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], // Keyframe timings
      repeatDelay: 0.5, // Pause at the end
    },
  },
};

const PDFLoader = ({
  pdfUrl,
  pageHeight = 1200,
  showNavigation = true,
  showPageNumber = true,
  variant = "default", // "default" | "compact"
  openHref = null,
  pageScale = 1,
  resetSignal = 0,
  onPositionChange = null,
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const documentContainerRef = useRef(null);
  const dragState = useRef({
    originX: 0,
    originY: 0,
    startX: 0,
    startY: 0,
  });
  const isCompact = variant === "compact";
  const effectiveScale = isCompact ? pageScale : 1;
  const pageWidthEstimate = Math.round(pageHeight * 0.82 * effectiveScale);
  const wrapperHeight = pageHeight + (isCompact ? 56 : 0);
  const chromeBase = isCompact
    ? "mx-auto max-w-[720px] shadow-[0_14px_38px_rgba(0,0,0,0.12)]"
    : "";

  useEffect(() => {
    setIsLoading(true);
    setPageNumber(1);
  }, [pdfUrl]);

  useEffect(() => {
    setDragOffset({ x: 0, y: 0 });
  }, [resetSignal]);

  useEffect(() => {
    if (onPositionChange) {
      onPositionChange(dragOffset.x !== 0 || dragOffset.y !== 0);
    }
  }, [dragOffset, onPositionChange]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragState.current.originX;
      const dy = e.clientY - dragState.current.originY;
      setDragOffset({
        x: dragState.current.startX + dx,
        y: dragState.current.startY + dy,
      });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const NavigationButton = ({ direction, isDisabled, onClick }) => (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className="p-2 rounded transition-transform duration-200 hover:scale-125 z-5"
    >
      <Image
        src={direction === "left" ? LeftArrow : RightArrow}
        alt={direction === "left" ? "Previous" : "Next"}
        width={60}
        height={60}
        className="min-h-10 min-w-10"
      />
    </button>
  );

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col flex-1 justify-center">
      <div
        className={`flex items-center justify-center w-full relative ${
          isCompact ? "mb-0" : "mb-10"
        }`}
        ref={documentContainerRef}
      >
        {pdfUrl ? (
          <>
            <ToolTip containerRef={documentContainerRef} />
            {showNavigation && (
              <NavigationButton
                direction="left"
                isDisabled={pageNumber <= 1}
                onClick={() => setPageNumber(pageNumber - 1)}
              />
            )}
            <div className={`top-0 ${isCompact ? "w-full" : "h-full"}`}>
              <div
                className={`relative rounded-full ${chromeBase}`}
                style={
                  isCompact
                    ? {
                        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                      }
                    : {}
                }
              >
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div
                      className="animate-pulse bg-[var(--cloud)] border border-[var(--grid-line)] rounded-[12px]"
                      style={{
                        width: pageWidthEstimate,
                        maxWidth: "100%",
                        height: wrapperHeight,
                      }}
                    />
                  </div>
                )}
                <div
                  className="relative overflow-auto no-scrollbar rounded-[14px] bg-white border border-[rgba(0,0,0,0.06)]"
                  style={{ maxHeight: wrapperHeight }}
                >
                  {isCompact && (
                    <div
                      className="sticky top-0 z-10 flex items-center px-3 pr-1 py-1.5 border-b border-[rgba(0,0,0,0.05)] bg-gradient-to-b from-white/92 to-[#f5f6fb] backdrop-blur rounded-t-[14px]"
                      onMouseDown={(e) => {
                        dragState.current = {
                          originX: e.clientX,
                          originY: e.clientY,
                          startX: dragOffset.x,
                          startY: dragOffset.y,
                        };
                        setIsDragging(true);
                      }}
                    >
                      <div className="flex items-center gap-2 mr-2">
                        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                        <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                        <span className="h-3 w-3 rounded-full bg-[#28c940]" />
                      </div>
                      <span className="flex-1 text-center text-[12px] font-medium text-[var(--muted-ink)] truncate px-2">
                        {pdfUrl?.split("/").pop() || "sample-report.pdf"}
                      </span>
                      {openHref ? (
                        <Link
                          href={openHref}
                          aria-label="Open full viewer"
                          className="group inline-flex h-7 w-7 items-center justify-center rounded-full bg-transparent text-[var(--muted-ink)] hover:text-[var(--ink)] transition ml-auto"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.5 6.75h7.75m0 0V14.5m0-7.75L9 15.75M15 21H7a2 2 0 0 1-2-2v-8"
                              className="opacity-90"
                            />
                          </svg>
                        </Link>
                      ) : (
                        <div className="w-8" />
                      )}
                    </div>
                  )}
                  <div
                    className={
                      isCompact
                        ? "flex justify-center px-2 sm:px-4 py-3 overflow-auto no-scrollbar rounded-b-[14px]"
                        : ""
                    }
                    style={isCompact ? { maxHeight: wrapperHeight - 36 } : {}}
                  >
                    <Document
                      file={pdfUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={() => setIsLoading(false)}
                      className={
                        isCompact ? "!m-0 flex justify-center" : "mb-4 mx-4"
                      }
                      style={{
                        visibility: isLoading ? "hidden" : "visible",
                        userSelect: "none",
                      }}
                    >
                      <Page
                        height={pageHeight}
                        pageNumber={pageNumber}
                        scale={effectiveScale}
                      />
                    </Document>
                  </div>
                  {isCompact && !isLoading && (
                    <div className="pointer-events-none absolute bottom-2 right-3 flex items-center gap-1 text-[10px] tracking-[0.08em] uppercase text-[var(--muted-ink)]/50">
                      <span className="inline-block h-2 w-2 border-b border-r border-[var(--muted-ink)]/10 rotate-45" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {showNavigation && (
              <NavigationButton
                direction="right"
                isDisabled={pageNumber >= numPages}
                onClick={() => setPageNumber(pageNumber + 1)}
              />
            )}
          </>
        ) : (
          <div
            className="w-full items-center flex flex-col"
            style={{ minWidth: "480px" }}
          >
            <div className="flex flex-col items-center justify-center h-full ">
              <Image
                src={medicalLogo}
                alt="Loading..."
                width={90}
                height={90}
              />
              <motion.h1
                className="font-inter text-3xl text-center font-bold overflow-hidden whitespace-nowrap border-r-2 border-red"
                initial="hidden"
                animate="visible"
                variants={typingVariants}
                style={{ overflow: "hidden", whiteSpace: "nowrap" }}
              >
                Select or upload a file...
              </motion.h1>
            </div>
          </div>
        )}
      </div>
      {showPageNumber && numPages && (
        <div className="h-10 page-number-area ">
          <p className="text-sm font-inter">
            Page {pageNumber} of {numPages}
          </p>
        </div>
      )}
    </div>
  );
};

export default PDFLoader;
