import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import user from "../assets/user.png";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import CallToAction from "../components/CallToAction";
import Form from "../components/Form";

const LandingPage = ({ isEmailVerified, onLogout }) => {
  const [isMenuIcon, setisMenuIcon] = useState(false);
  const toggleUserMenu = () => {
    setisMenuIcon((prev) => !prev);
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
              Logout
            </button>
          ) : (
            <>
              <button
                className="hidden sm:block border border-blue-600 px-5 py-1 hover:bg-blue-600 hover:rounded-[50px] hover:text-white"
                onClick={() => alert("Email Verified!")}
              >
                Verify Email
              </button>
              <NavLink to={"/register"}>
                <button
                  className="hidden sm:block border border-blue-600 px-5 py-1 hover:bg-blue-600 hover:rounded-[50px] hover:text-white"
                  onClick={onLogout}
                >
                  Sign in/up
                </button>
              </NavLink>
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
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CallToAction />
        <Form />
    </div>
  );
};

export default LandingPage;
