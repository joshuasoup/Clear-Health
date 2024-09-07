import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/globals.css";
import "../styles/viewer.css";
import Image from "next/image";
import plus from "../assets/plus.png";
import pdfIcon from "../assets/pdf-icon.png"; // Add a PDF icon image in your assets

const UploadButton = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    setIsUploading(true);
    try {
      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }
      const result = await response.json();
      console.log(result);
      setIsUploading(false);
      setIsModalVisible(false);
      setSelectedFile(null);
      if (props.handleAction) {
        props.handleAction(result.fileKey, result.fileKey);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedFile(null);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className="custom-button flex justify-between items-center w-full hover:bg-hover"
      >
        <span className="font-inter text-sm font-medium">Upload File</span>

        <Image src={plus} alt="plus" width={16} height={18} className="pr-2" />
      </button>

      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-40">
          <button
            className="absolute top-4 right-6 text-white font-semibold text-3xl hover:text-slate-300"
            onClick={handleCloseModal}
          >
            &times;
          </button>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-menu p-10 rounded-lg shadow-lg relative w-1/2"
          >
            {!isUploading && !selectedFile && (
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:hover:border-gray-500"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF (MAX. 500MB)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="application/pdf"
                />
              </label>
            )}

            {!isUploading && selectedFile && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Image
                  src={pdfIcon}
                  alt="pdf icon"
                  width={40}
                  height={40}
                  className="mb-2"
                />
                <h2 className="text-lg font-semibold">{selectedFile.name}</h2>
                <p className="text-sm text-gray-600">
                  {`${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`}
                </p>
                <div className="w-full">
                  <button
                    className=" text-red-500 hover:text-red-700 font-medium mr-6"
                    onClick={handleRemoveFile}
                  >
                    Remove File
                  </button>
                  <button
                    className={` px-4 py-2${
                      isUploading ? "bg-gray-400" : "bg-red-600"
                    } text-black rounded-md hover:bg-red-700 font-medium special-button ml-6`}
                    onClick={handleSubmit}
                    disabled={isUploading}
                    style={{ fontWeight: "400" }}
                  >
                    {isUploading ? "Uploading..." : "Upload File"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default UploadButton;
