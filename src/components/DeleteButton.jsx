import React, { useState } from "react";
import Image from "next/image";
import garbagecan from "../assets/images/garbagecan.png";
import warningIcon from "../assets/images/warning.png";
import { motion } from "framer-motion";

const DeleteButton = ({ fileKey, upSubmission }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const deleteFile = async (key) => {
    const url = "/api/delete-pdf";
    const body = JSON.stringify({ key });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete file: ${errorMessage}`);
      }

      const data = await response.json();
      console.log("Success:", data);
      upSubmission();
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      handleCloseModal(); // Ensure modal closes whether or not the delete was successful
    }
  };

  return (
    <>
      <button
        className="ml-1 transform hover:scale-110 duration-200"
        onClick={handleOpenModal}
      >
        <Image src={garbagecan} alt="Delete" width={15} height={15} />
      </button>

      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-40">
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
            className="bg-white p-8 rounded-lg shadow-lg w-1/3 relative"
            style={{ minWidth: "450px" }}
          >
            {/* Close Button */}

            {/* Warning Icon */}
            <div className="flex justify-center">
              <Image src={warningIcon} alt="Warning" width={50} height={50} />
            </div>

            {/* Modal Title */}
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
              Are you sure?
            </h2>

            {/* Modal Description */}
            <p className="text-gray-600 text-center mb-6">
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                className="px-6 py-2 bg-red text-white rounded-md hover:bg-rose-500 transition-all duration-300"
                onClick={() => deleteFile(fileKey)}
              >
                Delete File
              </button>
              <button
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-all duration-300"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default DeleteButton;
