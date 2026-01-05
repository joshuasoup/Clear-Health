"use client";
import React, { useState, useRef, useEffect } from "react";
import "../../styles/menu.css";
import "../../styles/globals.css";
import defaultAvatar from "../../assets/images/defaultAvatar.png"; // Assuming you have a default avatar
import Image from "next/image";
import { motion } from "framer-motion";
import "../../styles/viewer.css";

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Create a ref for the menu
  const buttonRef = useRef(null); // Create a ref for the button
  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      menuRef.current.focus(); // Focus on the menu div when it's open
    }
  }, [isMenuOpen]);

  // Close the menu when clicking outside of it
  const closeMenu = () => setIsMenuOpen(false);

  const profileImageUrl = defaultAvatar;
  const userName = "Guest";

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
          <div className="px-3 py-2 text-xs text-gray-500 font-inter">
            Temporary session
          </div>
          <div className="px-3 py-2 text-xs text-gray-500 font-inter">
            Close to continue
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Menu;
