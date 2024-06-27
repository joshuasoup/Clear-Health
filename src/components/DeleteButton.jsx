import React, { useState } from "react";
import Image from "next/image";
import garbagecan from "../assets/garbagecan.png";

const DeleteButton = ({ fileKey, upSubmission }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
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
      alert("File deleted successfully!");
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
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-menu p-10 rounded-lg shadow-lg relative w-1/2">
            <button
              className="absolute top-4 right-4 text-black font-semibold text-xl bg-menu"
              onClick={handleCloseModal}
            >
              &times; {/* Close Button */}
            </button>
            <p>Are you sure you want to delete this file?</p>
            <button onClick={() => deleteFile(fileKey)}>Delete</button>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButton;
