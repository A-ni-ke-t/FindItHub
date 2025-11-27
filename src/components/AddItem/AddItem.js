// src/components/AddItem/AddItem.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Typography,
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
import { addItem, uploadFile } from "../../helpers/fakebackend_helper";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useColorMode } from "../../theme/ThemeProvider";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const AddItem = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    image: "",
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const objectUrlRef = useRef(null);

  useEffect(() => {
    // cleanup preview URL on unmount
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
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

    // clean previous
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
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

  // uploads file (if provided) and returns the image path or empty string
  const uploadImageIfAny = async () => {
    if (!file) return "";
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await uploadFile(fd);
      // adapt depending on your API; try common shapes
      const possible = res?.data?.[0] || res?.data?.url || res?.data || "";
      return typeof possible === "string" ? possible : "";
    } catch (err) {
      console.error("upload error", err);
      throw new Error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.location.trim()
    ) {
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
      const res = await addItem(payload);
      const resData = res;

      if (resData.status === 200 || resData.success) {
        showSnackbar("Item added successfully!", "success");
        // reset form
        setFormData({ title: "", description: "", location: "", image: "" });
        setFile(null);
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = null;
        }
        setPreviewUrl("");
      } else {
        showSnackbar(resData.message || "Failed to add item.", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar(
        err.message || "Something went wrong while adding the item.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

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
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Add Lost Item
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
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />

            <Box
              sx={{
                mt: 2,
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
              }}
            >
              <input
                accept="image/*"
                id="additem-camera"
                type="file"
                capture="environment" // rear camera
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="additem-camera">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<PhotoCameraIcon />}
                  sx={{
                    textTransform: "none",
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary,
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                  }}
                >
                  Take a photo
                </Button>
              </label>

              <input
                accept="image/*"
                id="additem-filepicker"
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="additem-filepicker">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<FileUploadIcon />}
                  sx={{
                    textTransform: "none",
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary,
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                  }}
                >
                  Upload from files
                </Button>
              </label>

              {file ? (
                <Typography variant="body2" color="text.secondary">
                  Selected: <strong>{file.name}</strong>
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Optional — add a photo to help identify the item
                </Typography>
              )}
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
              sx={{ mt: 3 }}
            >
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
                {loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Add Item"
                )}
              </Button>

              <Button
                type="button"
                variant="outlined"
                onClick={() => {
                  setFormData({
                    title: "",
                    description: "",
                    location: "",
                    image: "",
                  });
                  setFile(null);
                  if (objectUrlRef.current) {
                    URL.revokeObjectURL(objectUrlRef.current);
                    objectUrlRef.current = null;
                  }
                  setPreviewUrl("");
                }}
                sx={{
                  textTransform: "none",
                  borderColor: theme.palette.divider,
                  color: theme.palette.text.primary,
                }}
                disabled={loading}
              >
                Reset
              </Button>

              <Box sx={{ flex: 1 }} />

              {/* Preview container */}
              <Box
                sx={{
                  width: { xs: "100%", sm: 200 },
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {previewUrl ? (
                  <CardMedia
                    component="img"
                    image={previewUrl}
                    alt="preview"
                    sx={{
                      width: "100%",
                      height: { xs: 140, sm: 160, md: 180 },
                      objectFit: "cover",
                      borderRadius: 1,
                      boxShadow: 2,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: { xs: 140, sm: 160, md: 180 },
                      borderRadius: 1,
                      backgroundColor:
                        theme.custom?.surfaceContrast?.muted ??
                        theme.palette.background.surface,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: theme.palette.text.secondary,
                      px: 1,
                    }}
                  >
                    <Typography variant="body2" align="center">
                      No image selected
                    </Typography>
                  </Box>
                )}
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Backdrop
        sx={(t) => ({
          color: t.palette.primary.contrastText,
          zIndex: t.zIndex.drawer + 1,
        })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddItem;
