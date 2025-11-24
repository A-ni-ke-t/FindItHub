// src/components/Home.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
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
  IconButton,
} from "@mui/material";
import {
  Search,
  GridView,
  ViewList,
  LocationOn,
  CalendarToday,
  Person,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { getItems } from "../../helpers/fakebackend_helper";
import { useColorMode } from "../../theme/ThemeProvider";

const Home = () => {
  const theme = useTheme();
  const { toggleColorMode, mode } = useColorMode();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // fetch items
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await getItems();
      const resData = response;
      if (resData?.status === 200 && Array.isArray(resData.data)) {
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

  // filter + search
  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === "All" || item.status === filter;
    const matchesSearch = (item.title || "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    const s = status
    console.log(s)
    if (s === false) return theme.custom?.status?.lost ?? theme.palette.error.main;
    if (s === true) return theme.custom?.status?.returned ?? theme.palette.success.main;
    return theme.custom?.status?.default ?? theme.palette.primary.main;
  };

  const handleViewChange = (_, nextView) => {
    if (nextView) setViewMode(nextView);
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        color: theme.palette.text.primary,
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: theme.palette.text.primary }}>
            Lost Items
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Browse and search for lost items
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Theme toggle */}
         

          {/* View Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            sx={{
              backgroundColor: theme.palette.action.hover,
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
            backgroundColor: theme.palette.background.paper,
            borderRadius: 3,
            "& .MuiOutlinedInput-root": { borderRadius: 3 },
            "& .MuiInputBase-input": { color: theme.palette.text.primary },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />

        {["All", "Found", "Returned"].map((type) => {
          const selected = filter === type;
          return (
            <Chip
              key={type}
              label={type}
              onClick={() => setFilter(type)}
              sx={{
                borderRadius: 3,
                px: 2,
                fontWeight: selected ? "bold" : "normal",
                bgcolor: selected ? theme.palette.action.selected : "transparent",
                color: selected ? theme.palette.primary.main : theme.palette.text.primary,
                "&:hover": { backgroundColor: theme.palette.action.hover },
                border: selected ? `1px solid ${theme.palette.primary.main}` : "1px solid transparent",
              }}
            />
          );
        })}
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
        <Grid container spacing={3} sx={{ justifyContent: "center", alignItems: "stretch" }}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id} sx={{ display: "flex", justifyContent: "center" }}>
              <Card
                sx={{
                  width: 300,
                  borderRadius: 3,
                  boxShadow: 2,
                  overflow: "hidden",
                  position: "relative",
                  transition: "0.25s",
                  backgroundColor: theme.palette.background.paper,
                  "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                }}
              >
                {item.image && (
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.title}
                    sx={{
                      height: { xs: 160, sm: 170, md: 180 },
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}

                <Chip
                  label={item.status || "Lost"}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: getStatusColor(item.returned),
                    color: theme.custom?.surfaceContrast?.onSurface || "#fff",
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
                    color="primary"
                    fullWidth
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
        // List view
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
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Avatar variant="rounded" src={item.image} alt={item.title} sx={{ width: 80, height: 80, mr: 2 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.location} • {item.createdBy?.fullName || "Unknown"}
                </Typography>
              </Box>

              <Chip
                label={item.status}
                sx={{
                  backgroundColor: getStatusColor(item.returned),
                  color: theme.custom?.surfaceContrast?.onSurface || "#fff",
                  fontWeight: "bold",
                }}
              />

              <Button
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
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
