import React, { useState } from "react";
import settingIcon from "../assets/settingIcon.png";
import logo from "../assets/logo.png";
import user from "../assets/user.png";

const Navbar = ({ income, setIncome, category, setCategory }) => {
  const [isSettingVisible, setIsSettingVisible] = useState(false);
  const [isMenuIcon, setisMenuIcon] = useState(false);

  const addCategory = (newCategory) => {
    setCategory([...category, newCategory]);
    setIsSettingVisible(false);
  };

  const removeCategory = (categoryRemove) => {
    setCategory(category.filter((c) => c !== categoryRemove));
    setIsSettingVisible(false);
  };

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
      <nav className="flex justify-between m-10  px-3 py-3">
        <img className="w-[100px]" src={logo} alt="" />
        <div className="flex gap-3 items-center">
          <button className="hidden sm:block border border-blue-600 px-5 py-1 hover:bg-blue-600 hover:rounded-[50px] hover:text-white">
            Login
          </button>
          <button className="hidden sm:block border border-blue-600 px-5 py-1 hover:bg-blue-600 hover:rounded-[50px] hover:text-white">
            Sign Up
          </button>
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
          <button className="text-black-500 border-b py-2 px-2 hover:bg-gray-100">
            Login
          </button>
          <button className="text-black-500 border-b py-2 px-2 hover:bg-gray-100">
            Sign Up
          </button>
        </div>
      )}

      {/* Settings Menu */}
      {isSettingVisible && (
        <div className="absolute py-10 px-5 border rounded-lg bg-white shadow-lg grid gap-2 right-[80px] top-[90px]">
          <button
            onClick={() => addCategory(prompt("Enter new category:"))}
            className="text-black-500 border-b py-2 px-2 hover:bg-gray-100"
          >
            Add Category
          </button>
          <button
            onClick={() => removeCategory(prompt("Enter category to remove:"))}
            className="text-black-500 border-b py-2 px-2 hover:bg-gray-100"
          >
            Remove Category
          </button>
          <button
            onClick={() => setIncome(prompt("Enter new income:"))}
            className="text-black-500 border-b py-2 px-2 hover:bg-gray-100"
          >
            Change Income
          </button>
          <button
            className="text-black-500 border-b py-2 px-2 hover:bg-gray-100"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;