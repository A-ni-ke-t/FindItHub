import React, { useState } from "react";
import "./AddItem.scss";
import Swal from "sweetalert2";
import { addItem, uploadFile } from "../../helpers/fakebackend_helper";

const AddItem = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    image: "", // image URL returned from backend
  });

  const [file, setFile] = useState(null); // for actual file upload
  const [loading, setLoading] = useState(false);

  // 🔹 Handle text changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle file select
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // 🔹 Upload image file and return path
  const uploadImage = async () => {
    if (!file) return "";

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);

    try {
      const uploadResponse = await uploadFile(formDataToSend);
      console.log("Upload response:", uploadResponse);

      // Depending on your backend, it might return { path: "/uploads/abc.jpg" }
      const imagePath =
        uploadResponse.data[0] ||
        "";

      if (imagePath) {
        return imagePath;
      } else {
        throw new Error("Image path not found in response.");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      Swal.fire("Error", "Failed to upload image.", "error");
      return "";
    }
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, location } = formData;
    if (!title || !description || !location) {
      Swal.fire({
        title: "Missing Fields",
        text: "Please fill out all required fields.",
        icon: "warning",
        confirmButtonColor: "#f6c23e",
      });
      return;
    }

    setLoading(true);
    try {
      // Step 1: Upload image if selected
      let imagePath = formData.image;
      if (file) {
        imagePath = await uploadImage();
      }

      // Step 2: Call addItem API
      const response = await addItem({
        ...formData,
        image: imagePath,
      });

      console.log("Add Item Response:", response);

      if (response.status === 200 || response.success) {
        await Swal.fire({
          title: "Item Added! 🎉",
          text: "Your item has been successfully added.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });

        setFormData({
          title: "",
          description: "",
          location: "",
          image: "",
        });
        setFile(null);
      } else {
        Swal.fire({
          title: "Error",
          text: response?.message || "Failed to add item. Please try again.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Add Item Error:", error);
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Something went wrong while adding the item.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
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
          Upload Image:
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        {file && (
          <p style={{ color: "green" }}>
            Selected: <strong>{file.name}</strong>
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>
    </div>
  );
};

export default AddItem;
