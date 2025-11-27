// src/components/ItemDetails/ItemDetails.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Divider,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Backdrop,
  Box,
  Paper,
  Stack,
  Chip,
  Avatar,
  IconButton,
  Dialog, 
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  getItemComments,
  postItemComment,
  markItemAsReturned,
} from "../../helpers/fakebackend_helper";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

const safeParse = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
};

const ItemDetails = () => {
  const theme = useTheme();
  const { state } = useLocation();
  const navigate = useNavigate();
  const item = state?.item;
  const [user, setUser] = useState(() => safeParse(localStorage.getItem("userInfo") || "{}"));

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [returning, setReturning] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const showSnackbar = (message, severity = "info") =>
    setSnackbar({ open: true, message, severity });

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // Fetch comments
  const fetchComments = async () => {
    if (!item?._id) return;
    setLoading(true);
    try {
      const response = await getItemComments(item._id);
      console.log("COMMENT RES",response)
      if (response.status === 200 && Array.isArray(response.data)) {
        setComments(response.data);
      } else setComments([]);
    } catch (err) {
      showSnackbar("Failed to load comments.", "error");
    } finally {
      setLoading(false);
    }
  };

  console.log("COMMENTS",comments)
  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?._id]);

  // Add new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return showSnackbar("Please enter a comment.", "warning");
    if (!item?._id) return;

    setPosting(true);
    try {
      const response = await postItemComment(item._id, { content: newComment });
      const resData =  response;
      if (resData.status === 200 || resData.success) {
        setNewComment("");
        showSnackbar("Comment added successfully!", "success");
        fetchComments();
      } else {
        showSnackbar(resData.message || "Failed to add comment.", "error");
      }
    } catch (err) {
      showSnackbar("Something went wrong while posting comment.", "error");
    } finally {
      setPosting(false);
    }
  };

  // Mark as returned
  const handleMarkAsReturned = async () => {
    if (!item?._id) return;
    setReturning(true);
    try {
      const response = await markItemAsReturned(item._id, {
        title: item.title,
        description: item.description,
      });
      const resData = response;
      console.log("resData",resData)
      if (resData.status === 200 || resData.success) {
        showSnackbar(resData.message, "success");
        navigate("/home");
      } else {
        showSnackbar(resData.message || "Failed to mark item as returned.", "error");
      }
    } catch (err) {
      showSnackbar("Something went wrong while marking returned.", "error");
    } finally {
      setReturning(false);
    }
  };

  if (!item)
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="body1">⚠️ No item data found. Please go back to the home page.</Typography>
      </Box>
    );

  // Helper: author initials
  const initials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "U";

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        // allow the component to take full width of its parent
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Card
        sx={{
          width: "100%", // FULL WIDTH as requested
          borderRadius: 3,
          boxShadow: 6,
          overflow: "visible",
          bgcolor: theme.palette.background.paper,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Header row */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                onClick={() => navigate("/home")}
                aria-label="back"
                size="medium"
                sx={{
                  borderRadius: 1,
                  bgcolor: theme.palette.action.selected,
                  color: theme.palette.text.primary,
                  "&:hover": { backgroundColor: theme.palette.action.hover },
                }}
              >
                <ArrowBackIcon />
              </IconButton>

              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {item.title}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    {item.location}
                  </Typography>
                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(item.createdAt || item.date || Date.now()).toLocaleString()}
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={item.returned ? "Returned" : "Not Returned"}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  fontWeight: 700,
                  backgroundColor:
                    item.returned ===  true
                      ? theme.custom?.status?.returned ?? theme.palette.success.main
                      : item.returned === true
                      ? theme.custom?.status?.found ?? theme.palette.warning.main
                      : item.returned === false
                      ? theme.custom?.status?.lost ?? theme.palette.error.main
                      : theme.palette.primary.main,
                  color: theme.custom?.surfaceContrast?.onSurface ?? theme.palette.primary.contrastText,
                }}
              />

              {(!item.returned && item.createdBy._id === user.userId) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleMarkAsReturned}
                  disabled={returning}
                  sx={{ textTransform: "none" }}
                >
                  {returning ? "Marking..." : "Mark as Returned"}
                </Button>
              )}
            </Stack>
          </Stack>

          {/* Image: responsive heights for mobile/desktop */}
          {item.image && (
            <>
            <Box
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 2,
          mb: 2,
          cursor: "pointer",
          display: "block",
        }}
        onClick={handleOpen} // open modal on click
      >
        <CardMedia
          component="img"
          image={item.image}
          alt={item.title}
          sx={{
            width: "100%",
            height: { xs: 200, sm: 260, md: 340 },
            objectFit: "cover",
            display: "block",
          }}
        />
      </Box>

      {/* Fullscreen modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg">
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.4)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
              zIndex: 10,
            }}
          >
            <CloseIcon />
          </IconButton>
          <CardMedia
            component="img"
            image={item.image}
            alt={item.title}
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: "90vh",
              objectFit: "contain",
              backgroundColor: "black",
            }}
          />
        </Box>
      </Dialog></>
          )}

          {/* Description & metadata */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 1.5 }}>
              <strong>Description:</strong> {item.description}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Typography variant="body2" color="text.secondary">
                <strong>Reported by:</strong> {item.createdBy?.fullName || "Unknown"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {item.createdBy?.emailAddress || "—"}
              </Typography>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Comments section */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">Comments</Typography>
              <Typography variant="caption" color="text.secondary">
                {comments.length} comment{comments.length !== 1 ? "s" : ""}
              </Typography>
            </Stack>

            <Box component="form" onSubmit={handleAddComment} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder={item.returned ? "Comments are disabled for returned items" : "Write a comment..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={posting || item.returned}
                sx={{
                  mb: 1.5,
                  backgroundColor: theme.custom?.surfaceElevated ?? theme.palette.background.surface,
                  borderRadius: 1,
                }}
                inputProps={{ "aria-label": "add comment" }}
              />

              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  variant="text"
                  onClick={() => {
                    setNewComment("");
                  }}
                  disabled={posting}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={posting || item.returned}
                  startIcon={posting ? <CircularProgress size={16} /> : null}
                  sx={{ textTransform: "none" }}
                >
                  {posting ? "Posting..." : "Add Comment"}
                </Button>
              </Stack>
            </Box>

            <Box>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                  <CircularProgress />
                </Box>
              ) : comments.length > 0 ? (
                <Stack spacing={1}>
                  {comments.map((c) => (
                    <Paper
                      key={c._id}
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: theme.custom?.surfaceElevated ?? theme.palette.background.surface,
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Avatar sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
                          {initials(c.userId?.fullName)}
                        </Avatar>

                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 600 }}>{c.userId?.fullName || "Anonymous"}</Typography>
                          <Typography sx={{ mb: 1 }}>{c.content}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(c.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">No comments yet. Be the first to comment!</Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Backdrop for long actions */}
      <Backdrop
        sx={(t) => ({ color: t.palette.primary.contrastText, zIndex: t.zIndex.drawer + 1 })}
        open={returning}
        aria-live="polite"
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ItemDetails;
