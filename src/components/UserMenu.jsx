import React, { useState, useRef, useEffect } from "react";
import { useUser, useClerk, UserButton } from "@clerk/clerk-react";
import "../styles/menu.css";
import "../styles/globals.css";
import defaultAvatar from "../assets/defaultAvatar.png"; // Assuming you have a default avatar
import { useRouter } from "next/navigation";
import Image from "next/image";

const Menu = ({ onProfileClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const menuRef = useRef(null); // Create a ref for the menu

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
    if (menuRef.current && !menuRef.current.contains(event.target)) {
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
    <div className="menu-container" tabIndex="0">
      <div className="menu-bar" onClick={toggleMenu}>
        <Image src={profileImageUrl} alt="User avatar" className="avatar" />
        {userName && <button className="user-name">{userName}</button>}
      </div>
      {isMenuOpen && (
        <div
          className={`menu ${isMenuOpen ? "open" : ""}`}
          ref={menuRef}
          tabIndex="1"
        >
          <button className="user-item" onBlur={closeMenu}>
            My Plan
          </button>
          {/* Use the onProfileClick prop passed from the parent */}
          <button
            className="user-item"
            onBlur={closeMenu}
            onClick={handleProfileClick}
          >
            My Profile
          </button>

          <hr
            className="w-48 flex my-2"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          />
          <button
            onClick={handleSignOut}
            onBlur={closeMenu}
            className="user-item"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;
