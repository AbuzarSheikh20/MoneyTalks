import React, { useState } from "react";
import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";

const RegistrationPage = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onSuccess(formData.email);
    } else {
      onSuccess(formData.name);
    }
  };

  return (
    <div className="mt-16 flex flex-col items-center justify-center">
      <img className="w-[150px] mb-10" src={logo} alt="MoneyTalk" />
      <div className="p-8 border border-blue-500 text-center shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6">
          {isLogin ? "Login" : "Create Account"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 text-gray-900 rounded-md"
                placeholder="Enter your name"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email ID
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 text-gray-900 rounded-md"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 text-gray-900 rounded-md"
              placeholder="Enter your password"
            />
          </div>
          <NavLink to={'/daily-entry'}>
            <button
              type="submit"
              className="mt-5 w-full border bg-blue-500 hover:border-blue-500 hover:bg-transparent text-white hover:text-black text-md font-medium py-2 px-4 rounded-md"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </NavLink>
        </form>
        <div className="mt-4 text-sm text-center flex justify-between">
          {isLogin ? <a href="#">Forgot Password?</a> : ""}
          <a
            href="#"
            className="underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
