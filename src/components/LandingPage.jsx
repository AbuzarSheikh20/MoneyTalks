import React, { useState } from "react";
import logo from "../assets/logo.png";
import user from "../assets/user.png";

const LandingPage = ({ userName, isEmailVerified, onLogout }) => {
  const [isMenuIcon, setisMenuIcon] = useState(false);
  const toggleUserMenu = () => {
    setisMenuIcon((prev) => !prev);
    setIsSettingVisible(false); // Close settings if user menu is opened
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <header className="w-full py-4 px-8 flex justify-between items-center bg-white shadow">
        <img className="w-[120px]" src={logo} alt="" />
        <div className="flex space-x-4">
          {isEmailVerified ? (
            <button
              className="bg-purple-600 text-white py-1 px-3 rounded-md"
              onClick={onLogout}
            >
              Login
            </button>
          ) : (
            <>
              <button
                className="hidden sm:block border border-blue-600 px-5 py-1 hover:bg-blue-600 hover:rounded-[50px] hover:text-white"
                onClick={() => alert("Email Verified!")}
              >
                Verify Email
              </button>
              <button
                className="hidden sm:block border border-blue-600 px-5 py-1 hover:bg-blue-600 hover:rounded-[50px] hover:text-white"
                onClick={onLogout}
              >
                Logout
              </button>
              <img
                className="w-6 sm:hidden h-6 text-gray-600 ml-10 cursor-pointer"
                src={user}
                alt="User Menu"
                onClick={toggleUserMenu}
              />
            </>
          )}
          {/* User Menu for Small Screens */}
          {isMenuIcon && (
            <div className="absolute sm:hidden py-5 px-5 border rounded-lg bg-white shadow-lg grid gap-2 right-[20px] top-[60px]">
              <button className="text-black-500 border-b py-2 px-2 hover:bg-gray-100">
                Login
              </button>
              <button className="text-black-500 border-b py-2 px-2 hover:bg-gray-100">
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">
          Hey {userName} 👋 Welcome to our app!
        </h1>
        <br />
        <p className="text-xl">
          MoneyTalk is Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia numquam saepe est soluta debitis quae quos reprehenderit iusto excepturi maiores.
        </p>
      </main>
    </div>
  );
};

export default LandingPage;
