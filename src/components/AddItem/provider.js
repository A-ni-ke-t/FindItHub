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
    if (!file) {
      return { success: false, reason: "NO_FILE" };
    }
  
    const fd = new FormData();
    fd.append("file", file);
  
    try {
      const res = await apiUploadFile(fd);
  
      // 413 TOO LARGE
      if (res?.error?.code === "413" || res?.error?.code === 413) {
        return { success: false, reason: "TOO_LARGE" };
      }
  
      const possible =
        res?.data?.[0] || res?.data?.url || res?.data || "";
  
      if (typeof possible === "string") {
        return { success: true, path: possible };
      }
  
      return { success: false, reason: "INVALID_RESPONSE" };
  
    } catch (err) {
      return { success: false, reason: "UPLOAD_FAILED" };
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
  
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.location.trim()
    ) {
      showSnackbar("Please fill in all required fields.", "warning");
      return;
    }
  
    if (!file) {
      showSnackbar("Image is required.", "warning");
      return;
    }
  
    setLoading(true);
  
    try {
      const uploadResult = await uploadImageIfAny();
  
      // ❌ STOP if upload failed → DO NOT RUN submit API
      if (!uploadResult.success) {
        setLoading(false);
  
        if (uploadResult.reason === "TOO_LARGE") {
          return showSnackbar("Image too large. Upload a smaller file.", "error");
        }
  
        if (uploadResult.reason === "UPLOAD_FAILED") {
          return showSnackbar("Image upload failed. Try again.", "error");
        }
  
        return showSnackbar("Image is required.", "warning");
      }
  
      // ✔ ONLY continue if upload is successful
      const payload = { ...formData, image: uploadResult.path };
      const res = await apiAddItem(payload);
  
      const ok = (res?.ok ?? res?.status === 200) || res?.success;
  
      if (ok) {
        showSnackbar("Item added successfully!", "success");
        resetForm();
      } else {
        showSnackbar(res?.message || "Failed to add item.", "error");
      }
  
    } catch (err) {
      showSnackbar("Something went wrong.", "error");
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
