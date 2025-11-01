import React, { useState } from "react";
import "./AddItem.scss";

const AddItem = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    dateLost: "",
    contact: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Item submitted:", formData);
    alert("Item added successfully!");
    setFormData({
      title: "",
      description: "",
      location: "",
      dateLost: "",
      contact: "",
    });
  };

  return (
    <div className="additem-container">
      <h1>Add Lost Item</h1>
      <form onSubmit={handleSubmit} className="additem-form">
        <label>
          Item Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Location Lost:
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date Lost:
          <input
            type="date"
            name="dateLost"
            value={formData.dateLost}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Contact Info:
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default AddItem;
