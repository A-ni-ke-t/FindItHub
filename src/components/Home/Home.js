import React, { useState } from "react";
import "./Home.scss";

const Home = () => {
  // Example static data (you can later fetch this from your backend)
  const [items] = useState([
    {
      id: 1,
      title: "Lost Wallet",
      description: "Brown leather wallet lost near city park.",
      location: "Central Park",
      dateLost: "2025-10-25",
      contact: "john@example.com",
    },
    {
      id: 2,
      title: "Black Backpack",
      description: "Contains a laptop and notebooks.",
      location: "Main Library",
      dateLost: "2025-10-28",
      contact: "jane@example.com",
    },
    {
      id: 3,
      title: "Silver Ring",
      description: "Engraved ring lost near cafeteria.",
      location: "City Mall",
      dateLost: "2025-10-30",
      contact: "alex@example.com",
    },
  ]);

  // State for toggling view mode
  const [viewMode, setViewMode] = useState("list");

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Lost Items</h1>
        <div className="view-toggle">
          <button
            className={viewMode === "card" ? "active" : ""}
            onClick={() => setViewMode("card")}
          >
            🗂 Card View
          </button>
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
          >
            🧾 List View
          </button>
        </div>
      </div>

      <p>Browse through the list of lost items reported by users.</p>

      {/* Conditionally render based on viewMode */}
      {viewMode === "card" ? (
        <div className="items-grid">
          {items.map((item) => (
            <div key={item.id} className="item-card">
              <h3>{item.title}</h3>
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Location:</strong> {item.location}</p>
              <p><strong>Date Lost:</strong> {item.dateLost}</p>
              <p><strong>Contact:</strong> {item.contact}</p>
            </div>
          ))}
        </div>
      ) : (
        <table className="items-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Location</th>
              <th>Date Lost</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.location}</td>
                <td>{item.dateLost}</td>
                <td>{item.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Home;
