import React, { useEffect, useState } from "react";
import "./Home.scss";
import Swal from "sweetalert2";
import { getItems } from "../../helpers/fakebackend_helper";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [items, setItems] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await getItems();
      const resData = response;

      if (resData.status === 200 && Array.isArray(resData.data)) {
        setItems(resData.data);
      } else {
        Swal.fire("No Items", "No lost items found.", "info");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to load items.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

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

      {loading ? (
        <p>Loading...</p>
      ) : viewMode === "card" ? (
        <div className="items-grid">
          {items.map((item) => (
            <div key={item._id} className="item-card">
              <h3>{item.title}</h3>
              <p><strong>Location:</strong> {item.location}</p>
              {item.image && <img src={item.image} alt={item.title} className="item-image" />}
              <button
                className="view-btn"
                onClick={() => navigate(`/items/${item._id}`, { state: { item } })}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <table className="items-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Reporter</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.location}</td>
                <td>{item.createdBy?.fullName}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => navigate(`/items/${item._id}`, { state: { item } })}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Home;
