import React, { useEffect, useState } from "react";

const Steps = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { title: "STEP 1", description: "Sign Up or Log In" },
    { title: "STEP 2", description: "Set Your Income" },
    { title: "STEP 3", description: "Add Categories" },
    { title: "STEP 4", description: "Add Products/Expenses" },
    { title: "STEP 5", description: "Review Your Budget" },
    { title: "STEP 6", description: "Edit or Manage Budget" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex justify-center items-center">
      <div className="w-72 py-16 sm:py-24 border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white flex flex-col justify-center items-center rounded-2xl transition-all duration-500 ease-in-out">
        <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
        <p>{steps[currentStep].description}</p>
      </div>
    </div>
  );
};

export default Steps;
