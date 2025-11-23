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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getItemComments,
  postItemComment,
  markItemAsReturned,
} from "../../helpers/fakebackend_helper";

const ItemDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const item = state?.item;

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

  const showSnackbar = (message, severity = "info") =>
    setSnackbar({ open: true, message, severity });

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // 🟩 Fetch comments
  const fetchComments = async () => {
    if (!item?._id) return;
    setLoading(true);
    try {
      const response = await getItemComments(item._id);
      const resData = response?.data || response;
      if (resData.status === 200 && Array.isArray(resData.data)) {
        setComments(resData.data);
      } else setComments([]);
    } catch (err) {
      showSnackbar("Failed to load comments.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [item]);

  // 🟦 Add new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return showSnackbar("Please enter a comment.", "warning");
    if (!item?._id) return;

    setPosting(true);
    try {
      const response = await postItemComment(item._id, { content: newComment });
      const resData = response?.data || response;
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

  // 🟨 Mark as returned
  const handleMarkAsReturned = async () => {
    if (!item?._id) return;
    setReturning(true);
    try {
      const response = await markItemAsReturned(item._id, {
        title: item.title,
        description: item.description,
      });
      const resData = response?.data || response;
      if (resData.status === 200 || resData.success) {
        showSnackbar("Item marked as returned!", "success");
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
      <Typography sx={{ p: 4 }}>
        ⚠️ No item data found. Please go back to the home page.
      </Typography>
    );

  return (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <Card
        sx={{
          width: "100%",
          maxWidth: 700,
          borderRadius: 4,
          boxShadow: 4,
          p: 2,
        }}
      >
        {/* Back Button */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/home")}
            sx={{ textTransform: "none", color: "#00bcd4" }}
          >
            Back to Home
          </Button>
        </Stack>

        {/* Image */}
        {item.image && (
          <CardMedia
            component="img"
            height="220"
            image={item.image}
            alt={item.title}
            sx={{
              objectFit: "cover",
              borderRadius: 2,
              mb: 2,
            }}
          />
        )}

        {/* Details */}
        <CardContent sx={{ p: 0 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {item.title}
          </Typography>

          <Typography variant="body1" sx={{ mb: 1.5 }}>
            <strong>Description:</strong> {item.description}
          </Typography>

          <Typography variant="body2">
            📍 <strong>Location:</strong> {item.location}
          </Typography>
          <Typography variant="body2">
            👤 <strong>Reported By:</strong> {item.createdBy?.fullName}
          </Typography>
          <Typography variant="body2">
            ✉️ <strong>Email:</strong> {item.createdBy?.emailAddress}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            🗓 <strong>Reported On:</strong>{" "}
            {new Date(item.createdAt).toLocaleString()}
          </Typography>

          {!item.returned ? (
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={handleMarkAsReturned}
              disabled={returning}
              sx={{
                mt: 2,
                textTransform: "none",
                backgroundColor: "#00bcd4",
                "&:hover": { backgroundColor: "#0097a7" },
              }}
            >
              {returning ? "Marking..." : "Mark as Returned ✅"}
            </Button>
          ) : (
            <Alert severity="success" sx={{ mt: 2 }}>
              ✅ This item has been marked as returned.
            </Alert>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Comments Section */}
          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>

          <form onSubmit={handleAddComment}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={item.returned}
            />
            <Button
              variant="contained"
              sx={{
                mt: 2,
                textTransform: "none",
                backgroundColor: "#00bcd4",
                "&:hover": { backgroundColor: "#0097a7" },
              }}
              type="submit"
              disabled={posting || item.returned}
            >
              {posting ? "Posting..." : "Add Comment"}
            </Button>
          </form>

          {/* Comments List */}
          <Box sx={{ mt: 3 }}>
            {loading ? (
              <Typography>Loading comments...</Typography>
            ) : comments.length > 0 ? (
              comments.map((c) => (
                <Paper
                  key={c._id}
                  elevation={1}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography>{c.content}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    By: {c.userId?.fullName || "Anonymous"} •{" "}
                    {new Date(c.createdAt).toLocaleString()}
                  </Typography>
                </Paper>
              ))
            ) : (
              <Typography color="text.secondary">No comments yet.</Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Loader Backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={returning}
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
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ItemDetails;
