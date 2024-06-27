import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Image from "next/image";
import RightArrow from "../assets/1.png";
import LeftArrow from "../assets/2.png";
import medicalLogo from "../assets/clearhealthlogo.png";
import "../../node_modules/react-pdf/dist/esm/Page/TextLayer.css";
import "../../node_modules/react-pdf/dist/esm/Page/AnnotationLayer.css";
import "../styles/globals.css";
import ToolTip from "./ToolTip";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFLoader = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const documentContainerRef = useRef();
  const [pageHeight, setPageHeight] = useState(window.innerHeight * 0.8);
  const [selectedText, setSelectedText] = useState("");

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
  };

  useEffect(() => {
    const handleResize = () => {
      setPageHeight(window.innerHeight * 0.8);
    };

    const handleTextSelect = () => {
      const selection = window.getSelection().toString();
      if (selection) {
        setSelectedText(selection);
      }
    };

    documentContainerRef.current.addEventListener("mouseup", handleTextSelect);
    window.addEventListener("resize", handleResize);

    return () => {
      if (documentContainerRef.current) {
        documentContainerRef.current.removeEventListener(
          "mouseup",
          handleTextSelect
        );
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 justify-center">
      <div
        className="flex items-center justify-center w-full h-100 relative mb-20"
        ref={documentContainerRef}
      >
        {pdfUrl ? (
          <>
            <ToolTip tooltipText={selectedText} ref={documentContainerRef} />
            <NavigationButton
              direction="left"
              isDisabled={pageNumber <= 1}
              onClick={() => setPageNumber(pageNumber - 1)}
            />
            <div className="h-full top-0 overflow-auto">
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                className="mb-4 mx-4"
              >
                <Page height={1200} pageNumber={pageNumber} />
              </Document>
            </div>

            <NavigationButton
              direction="right"
              isDisabled={pageNumber >= numPages}
              onClick={() => setPageNumber(pageNumber + 1)}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Image src={medicalLogo} alt="Loading..." width={90} height={90} />
            <h1 className="font-inter text-3xl text-center font-bold mt-6">
              Select or upload a file..
            </h1>
          </div>
        )}
      </div>
      {numPages && (
        <div className="h-10 page-number-area mb-6">
          <p className="text-sm font-inter">
            Page {pageNumber} of {numPages}
          </p>
        </div>
      )}
    </div>
  );
};

export default PDFLoader;
