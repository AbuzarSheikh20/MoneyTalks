import React from "react";
import bg from "../assets/bg.jpg";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section
      className="h-screen w-full flex items-center flex-col justify-center h-screen bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <motion.h1
        className="text-6xl font-bold text-white mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        Manage Your Finances Effortlessly
      </motion.h1>

      <motion.p
        className="text-xl mb-8 px-6 py-1 text-black bg-yellow-200"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        Track income, manage expenses, and plan your future.
      </motion.p>

      <motion.button
        className="hover:border bg-blue-600 px-6 py-3 hover:border-blue-600 hover:rounded-[50px] hover:text-md text-white hover:bg-transparent"
        whileTap={{ scale: 0.7 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        Get Started
      </motion.button>
    </section>
  );
};

export default HeroSection;
