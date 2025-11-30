// src/components/Profile/provider.js
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import generateContext from "../../common/context/generateContext";
import { updateProfile as apiUpdateProfile, changePassword as apiChangePassword } from "../../helpers/fakebackend_helper";

/**
 * Profile provider
 * - Keeps user info sync with localStorage
 * - Exposes functions to update profile and change password
 */
const safeParse = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
};

const useProfileProvider = () => {
  const navigate = useNavigate();

  // load stored user
  const stored = safeParse(localStorage.getItem("userInfo") || "{}") || {};

  const [user, setUser] = useState(stored);
  const [fullName, setFullName] = useState(stored.fullName || "");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // change password dialog
  const [pwdOpen, setPwdOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // sync with localStorage when other parts of app update userInfo (listening to custom event + storage change)
  useEffect(() => {
    const read = () => {
      const s = safeParse(localStorage.getItem("userInfo") || "{}") || {};
      setUser(s);
      setFullName(s.fullName || "");
    };

    // custom event used in other components when they update localStorage
    const onUserInfoChanged = () => read();

    const onStorage = (e) => {
      if (e.key === "userInfo" || e.key === "userInfo_updatedAt") {
        read();
      }
    };

    window.addEventListener("userInfoChanged", onUserInfoChanged);
    window.addEventListener("storage", onStorage);

    // initial read (in case)
    read();

    return () => {
      window.removeEventListener("userInfoChanged", onUserInfoChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const showSnackbar = (message, severity = "info") => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  const startEdit = () => setEditing(true);
  const cancelEdit = () => {
    setFullName(user.fullName || "");
    setEditing(false);
  };

  const saveProfile = async () => {
    const trimmed = (fullName || "").trim();
    if (!trimmed) {
      showSnackbar("Name cannot be empty.", "warning");
      return;
    }
    if (trimmed === (user.fullName || "").trim()) {
      showSnackbar("No changes to save.", "info");
      setEditing(false);
      return;
    }

    setLoading(true);
    try {
      // call helper
      const res = await apiUpdateProfile({ fullName: trimmed });

      const ok = res?.ok ?? res?.status === 200;
      if (!ok) {
        throw new Error(res?.message || `Request failed (${res?.status ?? "?"})`);
      }

      const data = res?.data ?? {};
      const updatedUser = { ...user, fullName: trimmed, ...data?.user };

      setUser(updatedUser);
      try {
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("userInfoChanged"));
        localStorage.setItem("userInfo_updatedAt", String(Date.now()));
      } catch (e) {
        // ignore storage errors
      }

      showSnackbar("Profile updated successfully.", "success");
      setEditing(false);
    } catch (err) {
      console.error("Update profile error:", err);
      showSnackbar(err?.message || "Failed to update profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- change password ----------------
  const openChangePwd = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowOld(false);
    setShowNew(false);
    setShowConfirm(false);
    setPwdOpen(true);
  };
  const closeChangePwd = () => setPwdOpen(false);

  const validatePasswordInputs = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showSnackbar("Please fill all password fields.", "warning");
      return false;
    }
    if (newPassword.length < 6) {
      showSnackbar("New password must be at least 6 characters.", "warning");
      return false;
    }
    if (newPassword !== confirmPassword) {
      showSnackbar("New password and confirm password do not match.", "error");
      return false;
    }
    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordInputs()) return;

    setLoading(true);
    try {
      const res = await apiChangePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });

      const ok = res?.ok ?? res?.status === 200;
      if (!ok) {
        throw new Error(res?.message || `Request failed (${res?.status ?? "?"})`);
      }

      showSnackbar(res?.message || "Password changed successfully.", "success");
      closeChangePwd();

      // optional: sign out after password change
      // localStorage.removeItem("userToken"); navigate("/login");
    } catch (err) {
      console.error("Change password error:", err);
      showSnackbar(err?.message || "Failed to change password.", "error");
    } finally {
      setLoading(false);
    }
  };

  return useMemo(
    () => ({
      // user
      user,
      fullName,
      setFullName,
      editing,
      startEdit,
      cancelEdit,
      saveProfile,

      // loading / ui
      loading,
      snackbar,
      showSnackbar,
      handleCloseSnackbar,

      // change password dialog
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
    }),
    [
      user,
      fullName,
      editing,
      loading,
      snackbar,
      pwdOpen,
      oldPassword,
      newPassword,
      confirmPassword,
      showOld,
      showNew,
      showConfirm,
    ]
  );
};

export const [profileProvider, useProfileContext] = generateContext(useProfileProvider);
