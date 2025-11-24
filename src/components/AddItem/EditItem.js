// src/components/EditItem/EditItem.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Button,
  Stack,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { patchItem, uploadFile } from "../../helpers/fakebackend_helper";
import { useColorMode } from "../../theme/ThemeProvider";

const EditItem = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

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
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: "info", message: "" });

  const objectUrlRef = useRef(null);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || "",
        description: item.description || "",
        location: item.location || "",
        image: item.image || "",
      });
      setPreviewUrl(item.image || "");
    }
  }, [item]);

  // cleanup object URL on unmount or when file changes
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);

    // revoke previous
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    if (f) {
      const url = URL.createObjectURL(f);
      objectUrlRef.current = url;
      setPreviewUrl(url);
    } else {
      setPreviewUrl(formData.image || "");
    }
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  const uploadImage = async () => {
    if (!file) return formData.image;
    try {
      const form = new FormData();
      form.append("file", file);
      const uploadResponse = await uploadFile(form);
      // adapt to your API: expecting uploadResponse.data[0] or uploadResponse.data.url, etc.
      const imagePath = uploadResponse?.data?.[0] || uploadResponse?.data?.url || "";
      return imagePath || formData.image;
    } catch (err) {
      console.error("upload error", err);
      showSnackbar("Image upload failed.", "error");
      return formData.image;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item?._id) {
      showSnackbar("Missing item ID.", "error");
      return;
    }
    // basic validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      showSnackbar("Please fill in all required fields.", "warning");
      return;
    }

    setLoading(true);
    try {
      const imagePath = await uploadImage();
      const updated = { ...formData, image: imagePath };

      const response = await patchItem(item._id, updated);
      const resData = response?.data ?? response;

      if (resData.status === 200 || resData.success) {
        showSnackbar("Item updated successfully!", "success");
        // small delay so user can see snackbar
        setTimeout(() => navigate("/home"), 800);
      } else {
        showSnackbar(resData.message || "Failed to update item.", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Something went wrong while updating the item.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!item) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>⚠️ No item data found. Go back to the home page.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 920,
          borderRadius: 3,
          boxShadow: 6,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems="flex-start"
          >
            {/* Left: Form */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Edit Item
              </Typography>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  label="Item Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                />

                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  multiline
                  minRows={4}
                />

                <TextField
                  label="Location Found/Lost"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                />

                <Box sx={{ mt: 2 }}>
                  <input
                    accept="image/*"
                    id="edititem-file"
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="edititem-file">
                    <Button
                      component="span"
                      variant="outlined"
                      startIcon={<Avatar sx={{ bgcolor: theme.palette.primary.main, width: 24, height: 24 }}>+</Avatar>}
                      sx={{
                        textTransform: "none",
                        borderColor: theme.palette.divider,
                        color: theme.palette.text.primary,
                        "&:hover": { backgroundColor: theme.palette.action.hover },
                      }}
                    >
                      Upload New Image
                    </Button>
                  </label>

                  {file && (
                    <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
                      Selected: <strong>{file.name}</strong>
                    </Typography>
                  )}
                </Box>

                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      "&:hover": { backgroundColor: theme.palette.action.selected },
                    }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    sx={{
                      textTransform: "none",
                      borderColor: theme.palette.divider,
                      color: theme.palette.text.primary,
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            </Box>

            {/* Right: Image preview */}
            <Box
              sx={{
                width: { xs: "100%", md: 340 },
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Preview
              </Typography>

              {previewUrl ? (
                <CardMedia
                  component="img"
                  image={previewUrl}
                  alt="preview"
                  sx={{
                    width: "100%",
                    height: { xs: 160, sm: 220, md: 280 },
                    objectFit: "cover",
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 160, sm: 220, md: 280 },
                    borderRadius: 2,
                    backgroundColor: theme.custom?.surfaceContrast?.muted ?? theme.palette.background.surface,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: theme.palette.text.secondary,
                  }}
                >
                  <Typography variant="body2">No image</Typography>
                </Box>
              )}

              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Image size will be optimized automatically
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Backdrop sx={{ color: "#fff", zIndex: (t) => t.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditItem;
