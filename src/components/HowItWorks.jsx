import React, { useEffect, useState } from "react";
import Steps from "../components/Steps.jsx";
import register from "../assets/register.png";
import income from "../assets/income.png";
import categories from "../assets/categories.png";
import categories from "../assets/categories.png";
import product from "../assets/product.png";
import review from "../assets/review.png";
import manage from "../assets/manage.png";

const HowItWorks = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    <img src={register} alt="Step 1 - image" />,
    <img src={income} alt="Step 2 - image" />,
    <img src={categories} alt="Step 3 - image" />,
    <img src={product} alt="Step 4 - image" />,
    <img src={review} alt="Step 5 - image" />,
    <img src={manage} alt="Step 6 - image" />,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="py-10 flex flex-col items-center justify-center w-full h-screen bg-gray-50">
      <h2 className="text-3xl font-semibold mb-10 text-center">How It Works</h2>
      <div className="flex w-full flex-col sm:flex-row items-center justify-center h-2/3">
        <div className="w-1/2">
          <Steps />
        </div>
        <div className="w-1/2 flex justify-center items-center">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`${index === currentStep ? "block" : "hidden"}`}
            >
              <div className="sm:w-3/5 w-4/5 mx-auto">{step}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
