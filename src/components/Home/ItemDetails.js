// src/components/ItemDetails/ItemDetails.jsx
import React, { useEffect } from "react";
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
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import withHOC from "../../common/hoc/with-hoc";
import { itemDetailsProvider, useItemDetailsContext } from "./itemDetailProvider";
import { placeholder } from "../../assets";

/**
 * ItemDetails - UI layer only, consumes useItemDetailsContext (provider)
 * Exported wrapped with withHOC(itemDetailsProvider, ItemDetails)
 */

const initialsFor = (name) =>
  name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

const ItemDetails = () => {
  const theme = useTheme();

  const {
    item,
    user,
    comments,
    newComment,
    setNewComment,
    loading,
    posting,
    returning,
    snackbar,
    closeSnackbar,
    handleAddComment,
    handleMarkAsReturned,
    imageModalOpen,
    openImageModal,
    closeImageModal,
    fetchComments,
  } = useItemDetailsContext();

  // If the provider fetched comments when mounted, keep UI updated.
  useEffect(() => {
    if (item?._id) fetchComments(item._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?._id]);

  if (!item)
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="body1">
          ⚠️ No item data found. Please go back to the home page.
        </Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Card
        sx={{
          width: "100%",
          borderRadius: 3,
          boxShadow: 6,
          overflow: "visible",
          bgcolor: theme.palette.background.paper,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Header */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                onClick={() => window.history.back()}
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
                    item.returned === true
                      ? theme.custom?.status?.returned ?? theme.palette.success.main
                      : item.returned === false
                      ? theme.custom?.status?.lost ?? theme.palette.error.main
                      : theme.palette.primary.main,
                  color: theme.custom?.surfaceContrast?.onSurface ?? theme.palette.primary.contrastText,
                }}
              />

              {(!item.returned && item.createdBy?._id === user?.userId) && (
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

          {/* Image and modal */}
          <Box
            sx={{
              width: "100%",
              overflow: "hidden",
              borderRadius: 2,
              mb: 2,
              cursor: "pointer",
            }}
            onClick={openImageModal}
          >
            <CardMedia
              component="img"
              image={item.image || placeholder}
              alt={item.title}
              sx={{
                width: "100%",
                height: { xs: 200, sm: 260, md: 340 },
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>

          <Dialog open={imageModalOpen} onClose={closeImageModal} maxWidth="lg">
            <Box sx={{ position: "relative" }}>
              <IconButton
                onClick={closeImageModal}
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
                image={item.image || placeholder}
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
          </Dialog>

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

          {/* Comments */}
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
                  onClick={() => setNewComment("")}
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
                          {initialsFor(c.userId?.fullName)}
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

      <Backdrop
        sx={(t) => ({ color: t.palette.primary.contrastText, zIndex: t.zIndex.drawer + 1 })}
        open={returning}
        aria-live="polite"
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default withHOC(itemDetailsProvider, ItemDetails);
