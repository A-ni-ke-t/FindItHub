import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getItemComments,
  postItemComment,
  markItemAsReturned,
} from "../../helpers/fakebackend_helper";
import generateContext from "../../common/context/generateContext";

const safeParse = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
};

const useItemDetailsProvider = () => {
  const location = useLocation();
  const itemFromState = location?.state?.item || null;

  // user from localStorage
  const [user, setUser] = useState(() =>
    safeParse(localStorage.getItem("userInfo") || "{}")
  );

  const [item, setItem] = useState(itemFromState);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false); // for fetching comments
  const [posting, setPosting] = useState(false); // for posting comment
  const [returning, setReturning] = useState(false); // for marking returned
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [imageModalOpen, setImageModalOpen] = useState(false);

  const showSnackbar = (message, severity = "info") =>
    setSnackbar({ open: true, message, severity });
  const closeSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // fetch comments for current item
  const fetchComments = async (id = item?._id) => {
    if (!id) {
      setComments([]);
      return;
    }
    setLoading(true);
    try {
      const response = await getItemComments(id);
      if (response?.status === 200 && Array.isArray(response.data)) {
        setComments(response.data);
      } else if (Array.isArray(response)) {
        setComments(response);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.error("fetchComments error:", err);
      showSnackbar("Failed to load comments.", "error");
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Keep local user in sync on mount (and when storage may have changed)
    const s = safeParse(localStorage.getItem("userInfo") || "{}");
    setUser(s || {});

    // If parent route passed item via state, keep it
    setItem(itemFromState || item);

    // fetch comments for the incoming item
    if (itemFromState?._id) fetchComments(itemFromState._id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemFromState]);

  // Add comment
  const handleAddComment = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!newComment.trim()) {
      showSnackbar("Please enter a comment.", "warning");
      return;
    }
    if (!item?._id) {
      showSnackbar("Item not found.", "error");
      return;
    }

    setPosting(true);
    try {
      const response = await postItemComment(item._id, { content: newComment });
      const resData = response;
      const ok = (resData?.ok ?? (resData?.status === 200)) || resData?.success;
      if (ok) {
        setNewComment("");
        showSnackbar("Comment added successfully!", "success");
        // refresh comments
        await fetchComments(item._id);
      } else {
        showSnackbar(resData?.message || "Failed to add comment.", "error");
      }
    } catch (err) {
      console.error("postItemComment error:", err);
      showSnackbar("Something went wrong while posting comment.", "error");
    } finally {
      setPosting(false);
    }
  };

  // Mark item as returned — update local item and broadcast change to home
  const handleMarkAsReturned = async () => {
    if (!item?._id) {
      showSnackbar("Item not found.", "error");
      return;
    }
    setReturning(true);
    try {
      const response = await markItemAsReturned(item._id, {
        title: item.title,
        description: item.description,
      });
      const resData = response;
      const ok = (resData?.status === 200) || resData?.success;

      if (ok) {
        showSnackbar(resData?.message || "Marked as returned.", "success");

        // Prefer any updated item returned by API
        const updatedFromResponse =
          resData?.data?.item ?? resData?.data ?? resData?.item ?? null;

        let updatedItem = null;
        if (updatedFromResponse && typeof updatedFromResponse === "object") {
          updatedItem = { ...(item || {}), ...updatedFromResponse };
          setItem(updatedItem);
        } else {
          // fallback: optimistically toggle returned flag
          updatedItem = { ...(item || {}), returned: true };
          setItem(updatedItem);
        }

        // Refresh comments
        await fetchComments(item._id);

        // Broadcast update so Home provider can update its items list
        try {
          window.dispatchEvent(
            new CustomEvent("itemUpdated", {
              detail: { item: updatedItem },
            })
          );
        } catch (e) {
          // older browsers fallback
          window.dispatchEvent(
            // simple event with JSON string in case CustomEvent not allowed
            new Event("itemUpdated")
          );
          // and place updated item in localStorage as fallback
          try {
            localStorage.setItem("lastUpdatedItem", JSON.stringify(updatedItem));
          } catch (err) {}
        }
      } else {
        showSnackbar(resData?.message || "Failed to mark item as returned.", "error");
      }
    } catch (err) {
      console.error("markItemAsReturned error:", err);
      showSnackbar("Something went wrong while marking returned.", "error");
    } finally {
      setReturning(false);
    }
  };

  const openImageModal = () => setImageModalOpen(true);
  const closeImageModal = () => setImageModalOpen(false);

  // Expose API (memoized)
  return useMemo(
    () => ({
      item,
      setItem,
      user,
      comments,
      newComment,
      setNewComment,
      loading,
      posting,
      returning,
      snackbar,
      showSnackbar,
      closeSnackbar,
      fetchComments,
      handleAddComment,
      handleMarkAsReturned,
      imageModalOpen,
      openImageModal,
      closeImageModal,
    }),
    [
      item,
      user,
      comments,
      newComment,
      loading,
      posting,
      returning,
      snackbar,
      imageModalOpen,
    ]
  );
};

export const [itemDetailsProvider, useItemDetailsContext] =
  generateContext(useItemDetailsProvider);

export default itemDetailsProvider;
