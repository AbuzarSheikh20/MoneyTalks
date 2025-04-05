import React from "react";

const Features = () => {
  const features = [
    { icon: "📊", title: "Track Expenses" },
    { icon: "💰", title: "Set Budgets" },
    { icon: "📈", title: "Analyze Spending" },
  ];

  return (
    <section className="py-20 w-full h-screen flex items-center justify-center flex-col bg-white text-center">
      <h2 className="text-3xl font-semibold mb-10">Key Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 group">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 border flex-col rounded-lg shadow-lg hover:shadow-xl hover:bg-orange-600 hover:text-white w-48 h-48 border rounded-[50%] flex items-center justify-center transition-all group-hover:blur-[2px] hover:!blur-none hover:scale-110 duration-400"
          >
            <div className="text-6xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold">{feature.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;