import React, { useState, useRef, useEffect } from "react";
import { useUser, useClerk, UserButton } from "@clerk/clerk-react";
import "../styles/menu.css";
import "../styles/globals.css";
import defaultAvatar from "../assets/images/defaultAvatar.png"; // Assuming you have a default avatar
import glasses from "../assets/images/glasses.png";
import exit from "../assets/images/signout.png";
import profile from "../assets/images/profile.png";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import PricingCatalog from "./PricingCatalog";
import "../styles/viewer.css";

const Menu = ({ onProfileClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const menuRef = useRef(null); // Create a ref for the menu
  const buttonRef = useRef(null); // Create a ref for the button
  const [modalOpen, setModalOpen] = useState(false); // State to control modal visibility

  const handleOpenModal = () => {
    setModalOpen(true); // Open the modal when the button is clicked
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Close the modal
  };

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const handleSignOut = () => {
    setIsMenuOpen(false);
    signOut(() => {
      router.push("/");
    });
  };

  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      menuRef.current.focus(); // Focus on the menu div when it's open
    }
  }, [isMenuOpen]);

  // Close the menu when clicking outside of it
  const closeMenu = () => setIsMenuOpen(false);

  const profileImageUrl = user?.profileImageUrl || defaultAvatar;
  const userName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : "";

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleProfileClick = () => {
    setIsMenuOpen(false); // Close the menu
    if (onProfileClick) {
      onProfileClick(); // Call the parent function
    }
  };

  return (
    <motion.div className="menu-container" tabIndex="0">
      <div className="menu-bar" onClick={toggleMenu} ref={buttonRef}>
        <Image src={profileImageUrl} alt="User avatar" className="avatar" />
        {userName && <button className="user-name">{userName}</button>}
      </div>
      {isMenuOpen && (
        <div
          className={`menu ${isMenuOpen ? "open" : ""}`}
          ref={menuRef}
          tabIndex="1"
        >
          <button
            className="user-item flex flex-row items-center"
            onClick={handleOpenModal}
            onBlur={closeMenu} // Close the modal when focus is lost
          >
            <Image
              src={glasses}
              width={24}
              height={24}
              className="mr-2"
              alt="Upgrade"
            />
            Upgrade
          </button>

          {modalOpen && (
            <div className=" modal-background w-screen h-screen">
              <button
                className="absolute top-4 right-6 text-white font-semibold text-3xl hover:text-slate-300"
                onClick={handleCloseModal}
              >
                &times;
              </button>
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ease: "easeOut", duration: 0.5 }}
                className="modal-content  w-200"
              >
                <PricingCatalog /> {/* Content of the modal */}
              </motion.div>
            </div>
          )}
          {/* Use the onProfileClick prop passed from the parent */}
          <button
            className="user-item flex flex-row items-center"
            onBlur={closeMenu}
            onClick={handleProfileClick}
          >
            <Image src={profile} width={20} className="mr-2" />
            My Profile
          </button>

          <hr
            className="w-48 flex my-2"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          />
          <button
            onClick={handleSignOut}
            onBlur={closeMenu}
            className="user-item flex flex-row centre items-center"
          >
            <Image src={exit} width={20} className="mr-2" />
            Sign out
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Menu;
