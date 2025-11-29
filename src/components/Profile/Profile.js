// src/components/Profile/Profile.jsx
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Stack,
  TextField,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTheme } from "@mui/material/styles";
import { useColorMode } from "../../theme/ThemeProvider";
import withHOC from "../../common/hoc/with-hoc";
import { profileProvider, useProfileContext } from "./provider";

const initials = (name) =>
  name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

const Profile = () => {
  const theme = useTheme();
  const { mode } = useColorMode();

  const {
    user,
    fullName,
    setFullName,
    editing,
    startEdit,
    cancelEdit,
    saveProfile,
    loading,
    snackbar,
    handleCloseSnackbar,
    // change password
    pwdOpen,
    openChangePwd,
    closeChangePwd,
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showOld,
    setShowOld,
    showNew,
    setShowNew,
    showConfirm,
    setShowConfirm,
    handleChangePassword,
  } = useProfileContext();

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
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 72,
                  height: 72,
                  fontSize: 28,
                }}
              >
                {initials(user.fullName)}
              </Avatar>

              <Box>
                {!editing ? (
                  <>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {user.fullName || "Unnamed User"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.emailAddress || "—"}
                    </Typography>
                  </>
                ) : (
                  <Stack spacing={1} sx={{ width: { xs: "100%", sm: 360 } }}>
                    <TextField
                      label="Full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      size="small"
                      fullWidth
                      autoFocus
                    />
                    <Typography variant="caption" color="text.secondary">
                      You can update your display name. Email cannot be changed.
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              {!editing ? (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={startEdit}
                    sx={{
                      textTransform: "none",
                      borderColor: theme.palette.divider,
                      color: theme.palette.text.primary,
                      "&:hover": { backgroundColor: theme.palette.action.hover },
                    }}
                  >
                    Edit Profile
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={openChangePwd}
                    sx={{
                      textTransform: "none",
                      borderColor: theme.palette.divider,
                      color: theme.palette.text.primary,
                      "&:hover": { backgroundColor: theme.palette.action.hover },
                      ml: 1,
                    }}
                  >
                    Change Password
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={saveProfile}
                    sx={{
                      textTransform: "none",
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      "&:hover": {
                        backgroundColor: theme.palette.action.selected,
                      },
                    }}
                    disabled={loading}
                  >
                    Save
                  </Button>

                  <IconButton
                    onClick={cancelEdit}
                    aria-label="cancel"
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      color: theme.palette.text.primary,
                      bgcolor: "transparent",
                      ml: 1,
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </>
              )}
            </Stack>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Additional profile info block */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Account Details
            </Typography>

            <Stack spacing={1}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography>{user.emailAddress || "—"}</Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={pwdOpen} onClose={closeChangePwd} maxWidth="xs" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <FormControl fullWidth variant="standard">
              <TextField
                label="Old password"
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowOld((s) => !s)} edge="end" size="small">
                        {showOld ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <FormControl fullWidth variant="standard">
              <TextField
                label="New password"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                helperText="Minimum 6 characters"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowNew((s) => !s)} edge="end" size="small">
                        {showNew ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <FormControl fullWidth variant="standard">
              <TextField
                label="Confirm new password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirm((s) => !s)} edge="end" size="small">
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeChangePwd} variant="text" sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": { backgroundColor: theme.palette.action.selected },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={18} color="inherit" /> : "Change Password"}
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{
          color: theme.palette.primary.contrastText,
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

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

export default withHOC(profileProvider, Profile);
