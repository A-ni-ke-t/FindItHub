import React, { useState } from "react";
import "./Profile.scss";

const Profile = () => {
  // Example static user data — later, fetch from backend or auth context
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    joined: "2024-07-15",
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    // Replace this with API call later
    alert("Password changed successfully!");
    setPasswordData({ newPassword: "", confirmPassword: "" });
    setShowModal(false);
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>

      <div className="profile-card">
        <div className="profile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Joined:</strong> {user.joined}</p>
        </div>

        <div className="profile-actions">
          <button onClick={() => setShowModal(true)}>Change Password</button>
        </div>
      </div>

      {/* Password Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordSubmit}>
              <label>
                New Password:
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Confirm New Password:
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <div className="modal-buttons">
                <button type="submit" className="save-btn">Save</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
