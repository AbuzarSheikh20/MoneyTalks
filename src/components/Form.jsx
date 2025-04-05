import React, { useState } from 'react';

const Form = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form Submitted', formData);
  };

  return (
    <section className="py-20 flex flex-col items-center justify-center w-full h-screen bg-gray-50 text-center">
      <h2 className="text-3xl font-semibold mb-10">Leave a Comment or Contact Us</h2>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </section>
  );
};

export default Form;