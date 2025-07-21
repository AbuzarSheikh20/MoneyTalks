import React, { useState, useEffect } from "react";
import bin from "../assets/bin.png";
import Navbar from "./Navbar.jsx";
import { useNavigate } from "react-router-dom";

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded shadow-lg min-w-[300px] max-w-[90vw]">
        {children}
        <button className="mt-4 px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [items, setItems] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState([]);
  const [income, setIncome] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Modal state
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showRemoveCategoryModal, setShowRemoveCategoryModal] = useState(false);
  // Modal form state
  const [newIncome, setNewIncome] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [removeCategoryValue, setRemoveCategoryValue] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Assume true for now, set to false on logout

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setIsLoggedIn(false);
      navigate("/register");
    } catch (err) {
      alert("Logout failed");
    }
  };

  // Fetch income and categories from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/user/income-categories`, { credentials: "include" });
        const data = await res.json();
        if (data.success) {
          if (!data.categories || data.categories.length === 0) {
            // Set default categories if none exist
            const defaultCategories = ["Food", "Transport", "Shopping", "Bills", "Other"];
            setCategory(defaultCategories);
            await fetch(`${API_BASE_URL}/user/income-categories`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ income: data.income, categories: defaultCategories }),
            });
          } else {
            setCategory(data.categories);
          }
          setIncome(data.income);
        }
      } catch {}
    };
    fetchUserData();
  }, []);

  // Fetch entries from backend
  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      setError("");
      try {
        let url = `${API_BASE_URL}/entries?date=${date}`;
        if (selectedCategory && selectedCategory !== "all") {
          url += `&category=${selectedCategory}`;
        }
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();
        if (data.success) {
          setItems(data.entries);
        } else {
          setError(data.message || "Failed to fetch entries");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, [date, selectedCategory]);

  // Add new entry (add row immediately, then save on edit)
  const addItem = () => {
    setItems([
      { _id: undefined, price: 0, details: "", category: category[0] || "Other", date },
      ...items,
    ]);
  };

  // Save new entry to backend when edited
  const saveNewItem = async (index) => {
    const entry = items[index];
    if (!entry.price || !entry.category) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(entry),
      });
      const data = await res.json();
      if (data.success) {
        const updated = [...items];
        updated[index] = data.entry;
        setItems(updated);
      }
    } catch {}
    setLoading(false);
  };

  // Update entry in backend
  const updateItem = async (index, field, value) => {
    const entry = items[index];
    const updatedEntry = { ...entry, [field]: field === "price" ? parseFloat(value) || 0 : value };
    setItems(items.map((item, i) => (i === index ? updatedEntry : item)));
    if (entry._id) {
      try {
        await fetch(`${API_BASE_URL}/entries/${entry._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedEntry),
        });
      } catch (err) {
        setError("Failed to update entry");
      }
    } else {
      // Save new entry to backend
      saveNewItem(index);
    }
  };

  // Delete entry in backend or remove unsaved row
  const deleteItem = async (index) => {
    const entry = items[index];
    if (entry._id) {
      try {
        await fetch(`${API_BASE_URL}/entries/${entry._id}`, {
          method: "DELETE",
          credentials: "include",
        });
        setItems(items.filter((_, i) => i !== index));
      } catch (err) {
        setError("Failed to delete entry");
      }
    } else {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Change income
  const handleChangeIncome = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/user/income-categories`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ income: parseFloat(newIncome), categories: category }),
      });
      const data = await res.json();
      if (data.success) {
        setIncome(data.income);
        setShowIncomeModal(false);
        setNewIncome("");
      }
    } catch {}
  };

  // Add category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    const updatedCategories = [...category, newCategory.trim()];
    try {
      const res = await fetch(`${API_BASE_URL}/user/income-categories`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ income, categories: updatedCategories }),
      });
      const data = await res.json();
      if (data.success) {
        setCategory(data.categories);
        setShowCategoryModal(false);
        setNewCategory("");
      }
    } catch {}
  };

  // Remove category
  const handleRemoveCategory = async (e) => {
    e.preventDefault();
    if (!removeCategoryValue) return;
    const updatedCategories = category.filter((c) => c !== removeCategoryValue);
    try {
      const res = await fetch(`${API_BASE_URL}/user/income-categories`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ income, categories: updatedCategories }),
      });
      const data = await res.json();
      if (data.success) {
        setCategory(data.categories);
        setShowRemoveCategoryModal(false);
        setRemoveCategoryValue("");
      }
    } catch {}
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const totalExpenses = items.reduce((acc, item) => acc + item.price, 0);
  const leftAmount = income - totalExpenses;
  const amountPerDay = parseFloat(income / daysInMonth).toFixed(2);

  const handleDateChange = (e) => setDate(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

  const filteredItems = items.filter(
    (item) =>
      item.date === date &&
      (selectedCategory === "all" || item.category === selectedCategory)
  );

  return (
    <div className="px-[10px] pb-2 sm:px-10 sm:pb-10 mx-auto w-full">
      <div className="mb-4">
        <Navbar
          income={income}
          setIncome={setIncome}
          category={category}
          setCategory={setCategory}
          onAddCategory={() => setShowCategoryModal(true)}
          onRemoveCategory={() => setShowRemoveCategoryModal(true)}
          onChangeIncome={() => setShowIncomeModal(true)}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      </div>
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
              onClick={() => setShowIncomeModal(true)}
              style={{ cursor: 'pointer' }}
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
                totalExpenses < amountPerDay
                    ? "text-green-500"
                    : "text-red-500"
              }`}
            />
          </div>
        </div>
      </div>
      <div className="px-[10px] grid lg:grid-cols-[5fr_3fr] gap-10">
        {/* Date and Category Filter */}
        <div className="grid gap-3 w-full">
          <div className="flex justify-between items-center w-full px-0">
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
            className="text-black border border-blue-500 h-10 mb-8 flex items-center justify-center font-medium hover:text-white hover:rounded-[50px] hover:bg-blue-600 px-[10px]"
            disabled={loading}
          >
            + Add Product
          </button>

          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center w-full gap-3 px-0"
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
          <div className="flex justify-between px-0">
            {filteredItems.length > 0 ? (
              <div className="border border-orange-500 w-full h-10 flex items-center justify-center font-medium text-white hover:text-black hover:border hover:rounded-[50px] bg-orange-500 hover:bg-transparent">
                Today's total price: {totalExpenses > 0 ? totalExpenses : 0} Rs
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
                onClick={() => setShowIncomeModal(true)}
                style={{ cursor: 'pointer' }}
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
      {/* Modals */}
      <Modal open={showIncomeModal} onClose={() => setShowIncomeModal(false)}>
        <form onSubmit={handleChangeIncome} className="flex flex-col gap-3">
          <label>New Income</label>
          <input type="number" value={newIncome} onChange={e => setNewIncome(e.target.value)} required className="border border-blue-300 bg-blue-50 px-2 py-1 rounded outline-blue-400" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Update Income</button>
        </form>
      </Modal>
      <Modal open={showCategoryModal} onClose={() => setShowCategoryModal(false)}>
        <form onSubmit={handleAddCategory} className="flex flex-col gap-3">
          <label>New Category</label>
          <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} required className="border border-blue-300 bg-blue-50 px-2 py-1 rounded outline-blue-400" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition">Add Category</button>
        </form>
      </Modal>
      <Modal open={showRemoveCategoryModal} onClose={() => setShowRemoveCategoryModal(false)}>
        <form onSubmit={handleRemoveCategory} className="flex flex-col gap-3">
          <label>Select Category to Remove</label>
          <select value={removeCategoryValue} onChange={e => setRemoveCategoryValue(e.target.value)} required className="border border-blue-300 bg-blue-50 px-2 py-1 rounded outline-blue-400">
            <option value="">Select</option>
            {category.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded mt-2">Remove Category</button>
        </form>
      </Modal>
    </div>
  );
};

export default LandingPage;
