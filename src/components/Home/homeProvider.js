import { useEffect, useMemo, useState } from "react";
import { getItems } from "../../helpers/fakebackend_helper";
import generateContext from "../../common/context/generateContext";

const useHomeProvider = () => {
  const [items, setItems] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Snackbar helpers
  const showSnackbar = (message, severity = "info") =>
    setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0); // reset page on search change
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  // Fetch items from API
  const fetchItems = async () => {
    setLoading(true);
    try {
      let query = "";
      if (debouncedSearch.trim() !== "") {
        query += `search=${encodeURIComponent(debouncedSearch)}`;
      }
      if (filter === "Returned") {
        query += (query ? "&" : "") + "returned=true";
      } else if (filter === "Not Returned") {
        query += (query ? "&" : "") + "returned=false";
      }

      const response = await getItems(query);
      const resData = response;

      if (resData?.status === 200 && Array.isArray(resData.data)) {
        setItems(resData.data);
      } else if (Array.isArray(resData)) {
        setItems(resData);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("fetchItems error:", err);
      showSnackbar("Failed to load items.", "error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when filters/search change
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filter]);

  // Listen for updates from ItemDetails (or other places) and update items array
  useEffect(() => {
    const handler = (ev) => {
      // ev.detail.item expected. But for older Event fallback we try localStorage.
      const detail = ev?.detail;
      let updated = detail?.item ?? null;

      if (!updated) {
        // fallback: read storage key (if provider wrote it)
        try {
          const raw = localStorage.getItem("lastUpdatedItem");
          if (raw) updated = JSON.parse(raw);
        } catch (e) {
          updated = null;
        }
      }

      if (!updated || !updated._id) return;

      setItems((prev) => {
        const found = prev.some((it) => it._id === updated._id);
        if (!found) {
          // optional: append if not present
          return [updated, ...prev];
        }
        return prev.map((it) => (it._id === updated._id ? { ...it, ...updated } : it));
      });
    };

    window.addEventListener("itemUpdated", handler);
    return () => window.removeEventListener("itemUpdated", handler);
  }, []);

  // Clamp page if items or rowsPerPage change
  useEffect(() => {
    const lastPage = Math.max(0, Math.ceil(items.length / rowsPerPage) - 1);
    if (page > lastPage) setPage(lastPage);
  }, [items, rowsPerPage, page]);

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewChange = (_, nextView) => {
    if (nextView) setViewMode(nextView);
  };

  // Derived: paginated items for current page
  const paginatedItems = useMemo(
    () =>
      items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [items, page, rowsPerPage]
  );

  return useMemo(
    () => ({
      // state
      items,
      viewMode,
      loading,
      filter,
      search,
      debouncedSearch,
      snackbar,
      page,
      rowsPerPage,
      paginatedItems,

      // setters / actions
      setItems,
      setViewMode,
      setFilter,
      setSearch,
      setPage,
      setRowsPerPage,
      fetchItems,
      showSnackbar,
      handleCloseSnackbar,
      handleChangePage,
      handleChangeRowsPerPage,
      handleViewChange,
    }),
    [
      items,
      viewMode,
      loading,
      filter,
      search,
      debouncedSearch,
      snackbar,
      page,
      rowsPerPage,
      paginatedItems,
    ]
  );
};

export const [homeProvider, useHomeContext] =
  generateContext(useHomeProvider);

export default homeProvider;
