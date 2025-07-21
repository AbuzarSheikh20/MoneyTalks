import React from 'react';

const CallToAction = () => {
  return (
    <section className="py-20 w-full h-screen flex flex-col items-center justify-center bg-blue-600 text-white text-center">
      <h2 className="text-3xl font-semibold mb-6">Ready to Start Managing Your Finances?</h2>
      <p className="mb-8">Join thousands of users already making smarter financial decisions.</p>
      <button className="bg-white text-blue-600 py-3 px-6 rounded-full hover:bg-gray-200 transition-transform transform hover:scale-105">
        Sign Up Now
      </button>
    </section>
  );
};

export default CallToAction;