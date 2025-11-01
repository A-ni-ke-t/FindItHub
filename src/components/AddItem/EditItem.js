import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./AddItem.scss";
import { patchItem, uploadFile } from "../../helpers/fakebackend_helper";

const EditItem = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const item = state?.item;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    image: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description,
        location: item.location,
        image: item.image || "",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!file) return formData.image;
    const formDataToSend = new FormData();
    formDataToSend.append("file", file);

    try {
      const uploadResponse = await uploadFile(formDataToSend);
      const imagePath = uploadResponse?.data?.[0] || "";
      return imagePath;
    } catch (err) {
      console.error("Image upload failed:", err);
      Swal.fire("Error", "Failed to upload image.", "error");
      return formData.image;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imagePath = await uploadImage();
      const updatedData = { ...formData, image: imagePath };

      const response = await patchItem(item._id, updatedData);
      if (response.status === 200 || response.success) {
        Swal.fire({
          title: "Updated!",
          text: "Item updated successfully.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        }).then(() => navigate("/dashboard"));
      } else {
        Swal.fire("Error", response?.message || "Failed to update item.", "error");
      }
    } catch (error) {
      console.error("Edit error:", error);
      Swal.fire("Error", "Something went wrong while updating.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!item)
    return (
      <p style={{ padding: "2rem" }}>⚠️ No item data found. Go back to home page.</p>
    );

  return (
    <div className="additem-container">
      <h1>Edit Item</h1>
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
          Location Found/Lost:
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Upload New Image (optional):
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

       {file ? (
  <img
    src={URL.createObjectURL(file)}
    alt="Preview"
    style={{ width: "150px", marginTop: "10px", borderRadius: "8px" }}
  />
) : (
  formData.image && (
    <img
      src={formData.image}
      alt="Current item"
      style={{ width: "150px", marginTop: "10px", borderRadius: "8px" }}
    />
  )
)}

        {file && (
          <p style={{ color: "green" }}>
            Selected: <strong>{file.name}</strong>
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Update Item"}
        </button>
      </form>
    </div>
  );
};

export default EditItem;
