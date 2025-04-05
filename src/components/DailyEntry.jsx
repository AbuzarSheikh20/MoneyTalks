import React, { useState } from "react";
import bin from "../assets/bin.png";
import Navbar from "./Navbar.jsx";

const LandingPage = () => {
  const [items, setItems] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState([]);
  const [income, setIncome] = useState(1000);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handleDateChange = (e) => setDate(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

  const filteredItems = items.filter(
    (item) =>
      item.date === date &&
      (selectedCategory === "all" || item.category === selectedCategory)
  );

  const total = filteredItems.reduce((acc, item) => acc + item.price, 0);

  const totalExpenses = items.reduce((acc, item) => acc + item.price, 0);
  const leftAmount = income - totalExpenses;
  const amountPerDay = parseFloat(income / daysInMonth).toFixed(2);

  const addItem = () =>
    setItems([...items, { price: 0, details: "", category: "", date }]);
  const deleteItem = (index) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] =
      field === "price" ? parseFloat(value) || 0 : value;
    setItems(updatedItems);
  };

  return (
    <div className="px-10 mx-auto w-full">
      <Navbar
        income={income}
        setIncome={setIncome}
        category={category}
        setCategory={setCategory}
      />
      {/* Details For Small Screen */}
      <div className="lg:hidden flex w-full gap-2 justify-between mb-10">
        <div className="w-1/3">
          <div className="bg-orange-100 p-3 border rounded flex flex-col items-center shadow-md">
            <h3>Income</h3>
            <input
              type="text"
              value={income}
              readOnly
              className="bg-transparent outline-none transition-transform duration-300 hover:scale-125 text-center font-bold"
            />
          </div>
        </div>
        <div className="w-1/3">
          <div className="bg-orange-100 p-3 border flex flex-col items-center rounded shadow-md">
            <h3 className="hidden sm:block">Left Amount</h3>
            <h3 className="sm:hidden">Left Amo</h3>
            <input
              type="text"
              value={leftAmount}
              readOnly
              className={`bg-transparent outline-none transition-transform duration-300 hover:scale-125 font-bold text-center`}
            />
          </div>
        </div>
        <div className="w-1/3">
          <div className="bg-orange-100 p-3 border flex flex-col items-center rounded shadow-md">
            <h3 className="hidden sm:block">Amount per day</h3>
            <h3 className="sm:hidden">Amo/day</h3>
            <input
              type="text"
              value={amountPerDay}
              readOnly
              className={`bg-transparent outline-none transition-transform duration-300 hover:scale-125 text-center font-bold ${
                totalExpenses < amountPerDay ? "text-green-500" : "text-red-500"
              }`}
            />
          </div>
        </div>
      </div>
      <div className="px-10 grid lg:grid-cols-[5fr_3fr] gap-10">
        {/* Date and Category Filter */}
        <div className="grid gap-3 w-full">
          <div className="flex justify-between items-center w-full">
            <div>
              <label className="hidden sm:flex" htmlFor="date">
                Date:
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={handleDateChange}
                className="ml-2 p-1 border rounded outline-none"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="p-1 w-2/4 border rounded"
            >
              <option value="all">All</option>
              {category.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Products List */}

          <button
            onClick={addItem}
            className="text-black border border-blue-500 h-10 mb-8 flex items-center justify-center font-medium hover:text-white hover:rounded-[50px] hover:bg-blue-600"
          >
            + Add Product
          </button>

          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center w-full gap-3"
            >
              <input
                type="text"
                value={item.price || ""}
                onChange={(e) => updateItem(index, "price", e.target.value)}
                className="px-3 w-1/4 overflow-hidden py-2 border rounded outline-none"
                placeholder="Price"
              />
              <input
                type="text"
                value={item.details}
                onChange={(e) => updateItem(index, "details", e.target.value)}
                className="px-3 w-1/4 overflow-hidden py-2 border rounded outline-none"
                placeholder="Detail"
              />
              <select
                value={item.category}
                onChange={(e) => updateItem(index, "category", e.target.value)}
                className="px-3 w-1/4 overflow-hidden py-2 border rounded outline-none"
              >
                {category.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="flex space-x-2">
                <img
                  className="w-5 h-5 text-gray-500 cursor-pointer"
                  onClick={() => deleteItem(index)}
                  src={bin}
                  alt="Delete"
                />
              </div>
            </div>
          ))}
          <div className="flex justify-between">
            {filteredItems.length > 0 ? (
              <div className="border border-orange-500 w-full h-10 flex items-center justify-center font-medium text-white hover:text-black hover:border hover:rounded-[50px] bg-orange-500 hover:bg-transparent">
                Today's total price: {total > 0 ? total : 0} Rs
              </div>
            ) : (
              <p className="w-full text-xl font-bold text-gray-500 text-center">
                No Entries!
              </p>
            )}
          </div>
        </div>

        {/* Income, Left Amount, Amount Per Day */}
        <div className="hidden lg:grid grid-row-3 gap-4 h-[300px] ">
          <div>
            <div className="bg-orange-100 p-3 border rounded flex flex-col items-center shadow-md">
              <h3>Income</h3>
              <input
                type="text"
                value={income}
                readOnly
                className="bg-transparent outline-none transition-transform duration-300 hover:scale-125 text-center font-bold"
              />
            </div>
          </div>
          <div>
            <div className="bg-orange-100 p-3 border flex flex-col items-center rounded shadow-md">
              <h3>Left Amount</h3>
              <input
                type="text"
                value={leftAmount}
                readOnly
                className={`bg-transparent outline-none transition-transform duration-300 hover:scale-125 font-bold text-center`}
              />
            </div>
          </div>
          <div>
            <div className="bg-orange-100 p-3 border flex flex-col items-center rounded shadow-md">
              <h3>Amount per day</h3>
              <input
                type="text"
                value={amountPerDay}
                readOnly
                className={`bg-transparent outline-none transition-transform duration-300 hover:scale-125 text-center font-bold ${
                  totalExpenses < amountPerDay
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
