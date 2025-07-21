import React, { useState, useEffect, useRef } from "react";
import settingIcon from "../assets/settingIcon.png";
import logo from "../assets/logo.png";
import user from "../assets/user.png";
import { NavLink } from "react-router-dom";

const Navbar = ({ income, setIncome, category, setCategory, onAddCategory, onRemoveCategory, onChangeIncome, isLoggedIn, onLogout }) => {
  const [isSettingVisible, setIsSettingVisible] = useState(false);
  const [isMenuIcon, setisMenuIcon] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    if (!isSettingVisible) return;
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSettingVisible]);

  const toggleSettings = () => {
    setIsSettingVisible((prev) => !prev);
    setisMenuIcon(false); // Close user menu if settings are opened
  };

  const toggleUserMenu = () => {
    setisMenuIcon((prev) => !prev);
    setIsSettingVisible(false); // Close settings if user menu is opened
  };

  return (
    <div className="shadow-md bg-white md:w-full">
      <nav className="flex justify-between px-2 py-3">
        <img className="w-[100px]" src={logo} alt="" />
        <div className="flex gap-3 items-center">
          <NavLink to={"/"}>
            <button className="hidden sm:block border bg-blue-600 px-5 py-1 hover:border-blue-600 hover:rounded-[50px] hover:text-black text-white hover:bg-transparent">
              Home
            </button>
          </NavLink>
          <NavLink to={"/register"}>
            <button className="hidden sm:block border bg-blue-600 px-5 py-1 hover:border-blue-600 hover:rounded-[50px] hover:text-black text-white hover:bg-transparent">
              Logout
            </button>
          </NavLink>
          <img
            className="w-6 sm:hidden h-6 text-gray-600 ml-10 cursor-pointer"
            src={user}
            alt="User Menu"
            onClick={toggleUserMenu}
          />
          <img
            onClick={toggleSettings}
            className="w-6 h-6 text-gray-600 sm:ml-10 cursor-pointer"
            src={settingIcon}
            alt="Settings"
          />
        </div>
      </nav>

      {/* User Menu for Small Screens */}
      {isMenuIcon && (
        <div className="absolute py-5 px-5 border rounded-lg bg-white shadow-lg grid gap-2 right-[110px] top-[90px]">
          {isLoggedIn ? (
            <button className="text-black-500 border-b py-2 px-2 hover:bg-gray-100" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <>
              <button className="text-black-500 border-b py-2 px-2 hover:bg-gray-100">
                Login
              </button>
              <button className="text-black-500 border-b py-2 px-2 hover:bg-gray-100">
                Sign Up
              </button>
            </>
          )}
        </div>
      )}

      {/* Settings Menu */}
      {isSettingVisible && (
        <div ref={settingsRef} className="absolute py-10 px-5 border rounded-lg bg-white shadow-lg grid gap-2 right-[80px] top-[90px]">
          <button
            onClick={() => { setIsSettingVisible(false); onAddCategory && onAddCategory(); }}
            className="text-black-500 border-b py-2 px-2 hover:bg-gray-100"
          >
            Add Category
          </button>
          <button
            onClick={() => { setIsSettingVisible(false); onRemoveCategory && onRemoveCategory(); }}
            className="text-black-500 border-b py-2 px-2 hover:bg-gray-100"
          >
            Remove Category
          </button>
          <button
            onClick={() => { setIsSettingVisible(false); onChangeIncome && onChangeIncome(); }}
            className="text-black-500 border-b py-2 px-2 hover:bg-gray-100"
          >
            Change Income
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;