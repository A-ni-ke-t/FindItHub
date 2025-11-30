// src/components/AddItem/provider.js
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addItem as apiAddItem, uploadFile as apiUploadFile } from "../../helpers/fakebackend_helper";
import generateContext from "../../common/context/generateContext";

/**
 * AddItem provider using your existing generateContext pattern.
 * Exports: [addItemProvider, useAddItemContext]
 */

const useAddItemProvider = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    image: "",
  });

  const [file, setFile] = useState(null);
  const objectUrlRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        try {
          URL.revokeObjectURL(objectUrlRef.current);
        } catch (e) {}
        objectUrlRef.current = null;
      }
    };
  }, []);

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };
  const closeSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);

    if (objectUrlRef.current) {
      try {
        URL.revokeObjectURL(objectUrlRef.current);
      } catch (e) {}
      objectUrlRef.current = null;
    }

    if (f) {
      const url = URL.createObjectURL(f);
      objectUrlRef.current = url;
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  };

  const uploadImageIfAny = async () => {
    if (!file) return "";
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await apiUploadFile(fd);
      // adapt to common shapes returned by backend
      const possible = res?.data?.[0] || res?.data?.url || res?.data || "";
      return typeof possible === "string" ? possible : "";
    } catch (err) {
      console.error("upload error", err);
      throw new Error("Image upload failed");
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", location: "", image: "" });
    setFile(null);
    if (objectUrlRef.current) {
      try {
        URL.revokeObjectURL(objectUrlRef.current);
      } catch (e) {}
      objectUrlRef.current = null;
    }
    setPreviewUrl("");
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    // basic validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      showSnackbar("Please fill in all required fields.", "warning");
      return;
    }

    setLoading(true);
    try {
      let imagePath = formData.image || "";
      if (file) {
        imagePath = await uploadImageIfAny();
      }

      const payload = { ...formData, image: imagePath };
      const res = await apiAddItem(payload);
      const resData = res;

      const ok = (resData?.ok ?? resData?.status === 200) || resData?.success;
      if (ok) {
        showSnackbar("Item added successfully!", "success");
        resetForm();
        // optional: navigate("/home");
      } else {
        showSnackbar(resData?.message || "Failed to add item.", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar(err?.message || "Something went wrong while adding the item.", "error");
    } finally {
      setLoading(false);
    }
  };

  return useMemo(
    () => ({
      formData,
      setFormData,
      file,
      setFile,
      previewUrl,
      setPreviewUrl,
      loading,
      snackbar,
      showSnackbar,
      closeSnackbar,
      handleChange,
      handleFileChange,
      handleSubmit,
      resetForm,
    }),
    [formData, file, previewUrl, loading, snackbar]
  );
};

export const [addItemProvider, useAddItemContext] = generateContext(useAddItemProvider);
