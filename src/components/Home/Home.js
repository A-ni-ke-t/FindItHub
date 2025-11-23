import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Avatar,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Alert,
} from "@mui/material";
import { Search, GridView, ViewList, LocationOn, CalendarToday, Person } from "@mui/icons-material";
import { getItems } from "../../helpers/fakebackend_helper";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [items, setItems] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const navigate = useNavigate();

  // 🔹 Fetch items from API
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await getItems();
        console.log("response",response)

      const resData = response;
      if (resData.status === 200 && Array.isArray(resData.data)) {
        setItems(resData.data);
      } else {
        setSnackbar({ open: true, message: "No items found.", severity: "info" });
      }
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to load items.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  console.log("ITEMS",items)
  // 🔹 Filter + Search logic
  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === "All" || item.status === filter;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleViewChange = (_, nextView) => {
    if (nextView) setViewMode(nextView);
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const getStatusColor = (status) => {
    switch (status) {
      case "Lost":
        return "#e53935";
      case "Found":
        return "#fbc02d";
      case "Returned":
        return "#43a047";
      default:
        return "#0288d1";
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, backgroundColor: "#f9fbfc", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            Lost Items
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Browse and search for lost items
          </Typography>
        </Box>

        {/* View Toggle */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          sx={{
            backgroundColor: "#e0f7fa",
            borderRadius: 2,
          }}
        >
          <ToggleButton value="grid" sx={{ border: "none" }}>
            <GridView />
          </ToggleButton>
          <ToggleButton value="list" sx={{ border: "none" }}>
            <ViewList />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Search + Filter */}
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, mb: 4 }}>
        <TextField
          placeholder="Search items or locations..."
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flexGrow: 1,
            backgroundColor: "#fff",
            borderRadius: 3,
            "& .MuiOutlinedInput-root": { borderRadius: 3 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {["All", "Lost", "Found", "Returned"].map((type) => (
          <Chip
            key={type}
            label={type}
            color={filter === type ? "primary" : "default"}
            onClick={() => setFilter(type)}
            sx={{
              borderRadius: 3,
              px: 2,
              fontWeight: filter === type ? "bold" : "normal",
            }}
          />
        ))}
      </Box>

      {/* Items */}
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={280} />
            </Grid>
          ))}
        </Grid>
      ) : filteredItems.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center" mt={5}>
          No items match your search.
        </Typography>
      ) : viewMode === "grid" ? (
         <Grid
    container
    spacing={3}
    sx={{
      justifyContent: "center",
      alignItems: "stretch",
    }}
  >
    {filteredItems.map((item) => (
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        key={item._id}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Card
          sx={{
            width: 300, // 👈 fixed card width (like in your screenshot)
            borderRadius: 4,
            boxShadow: 2,
            overflow: "hidden",
            position: "relative",
            transition: "0.3s",
            "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
          }}
        >
          {item.image && (
           <CardMedia
  component="img"
  image={item.image}
  alt={item.title}
  sx={{
    height: 180, // 👈 Fixed image area
    width: "100%",
    objectFit: "cover", // ensures the image fills evenly
    borderTopLeftRadius: "inherit",
    borderTopRightRadius: "inherit",
  }}
/>
          )}
          <Chip
            label={item.status || "Lost"}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: getStatusColor(item.status),
              color: "#fff",
              fontWeight: "bold",
            }}
          />
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {item.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationOn fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {item.location}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Person fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {item.createdBy?.fullName || "Unknown"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CalendarToday fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {new Date(item.date || Date.now()).toLocaleDateString()}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#00bcd4",
                borderRadius: 2,
                textTransform: "none",
                "&:hover": { backgroundColor: "#0097a7" },
              }}
              onClick={() => navigate(`/items/${item._id}`, { state: { item } })}
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
      ) : (
        // List View
        <Box>
          {filteredItems.map((item) => (
            <Card
              key={item._id}
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                p: 2,
                borderRadius: 3,
                boxShadow: 1,
              }}
            >
              <Avatar
                variant="rounded"
                src={item.image}
                alt={item.title}
                sx={{ width: 80, height: 80, mr: 2 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.location} • {item.createdBy?.fullName || "Unknown"}
                </Typography>
              </Box>
              <Chip
                label={item.status}
                sx={{
                  backgroundColor: getStatusColor(item.status),
                  color: "#fff",
                  fontWeight: "bold",
                }}
              />
              <Button
                variant="contained"
                sx={{ ml: 2, backgroundColor: "#00bcd4", "&:hover": { backgroundColor: "#0097a7" } }}
                onClick={() => navigate(`/items/${item._id}`, { state: { item } })}
              >
                View
              </Button>
            </Card>
          ))}
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
