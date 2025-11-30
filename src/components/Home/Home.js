// src/components/Home/Home.jsx
import React, { useEffect } from "react";
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
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  TablePagination,
} from "@mui/material";
import {
  Search,
  GridView,
  ViewList,
  LocationOn,
  CalendarToday,
  Person,
  OpenInNew,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "../../theme/ThemeProvider";
import { placeholder } from "../../assets";
import withHOC from "../../common/hoc/with-hoc";
import { homeProvider, useHomeContext } from "./homeProvider";

const Home = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const navigate = useNavigate();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const {
    items,
    viewMode,
    loading,
    filter,
    search,
    snackbar,
    page,
    rowsPerPage,
    paginatedItems,
    setFilter,
    setSearch,
    setPage,
    setViewMode,
    handleViewChange,
    handleCloseSnackbar,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useHomeContext();

  // Force grid view on small screens (same behavior as before)
  useEffect(() => {
    if (!isSmUp && viewMode === "list") {
      setViewMode("grid");
    }
  }, [isSmUp, viewMode, setViewMode]);

  const getStatusColor = (status) => {
    if (status === false)
      return theme.custom?.status?.lost ?? theme.palette.error.main;
    if (status === true)
      return theme.custom?.status?.returned ?? theme.palette.success.main;
    if (typeof status === "string") {
      if (status.toLowerCase().includes("returned"))
        return theme.custom?.status?.returned ?? theme.palette.success.main;
      if (status.toLowerCase().includes("lost"))
        return theme.custom?.status?.lost ?? theme.palette.error.main;
      return theme.custom?.status?.default ?? theme.palette.primary.main;
    }
    return theme.custom?.status?.default ?? theme.palette.primary.main;
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
          top: 0,
          zIndex: (t) => t.zIndex.appBar - 1,
          bgcolor: "transparent",
        }}
      >
        <Box>
          <Typography variant="h4">Lost Items</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Browse and search for lost items
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          sx={{ backgroundColor: theme.palette.action.hover }}
        >
          <ToggleButton value="list" sx={{ border: "none" }}>
            <ViewList />
          </ToggleButton>
          <ToggleButton value="grid" sx={{ border: "none" }}>
            <GridView />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Search + Filters */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
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

        <Box
          sx={{
            display: "flex",
            gap: 1,
            overflowX: "auto",
            whiteSpace: "nowrap",
            pb: 1,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {["All", "Returned", "Not Returned"].map((type) => {
            const selected = filter === type;
            return (
              <Chip
                key={type}
                label={type}
                onClick={() => {
                  setFilter(type);
                  setPage(0);
                }}
                sx={{
                  borderRadius: 3,
                  px: 2,
                  whiteSpace: "nowrap",
                  fontWeight: selected ? "bold" : "normal",
                  bgcolor: selected
                    ? theme.palette.action.selected
                    : "transparent",
                  color: selected
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                  "&:hover": { backgroundColor: theme.palette.action.hover },
                  border: selected
                    ? `1px solid ${theme.palette.primary.main}`
                    : "1px solid transparent",
                }}
              />
            );
          })}
        </Box>
      </Box>

      {/* MAIN CONTENT */}
      {loading ? (
        viewMode === "grid" ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={i}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    width: 300,
                    borderRadius: 3,
                    boxShadow: 2,
                    overflow: "hidden",
                    position: "relative",
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <Skeleton variant="rectangular" height={180} width="100%" />
                  <CardContent>
                    <Skeleton width="60%" height={24} sx={{ mb: 1 }} />
                    <Skeleton width="40%" height={16} sx={{ mb: 1 }} />
                    <Skeleton width="80%" height={16} sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" width="100%" height={36} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          // table skeleton
          <TableContainer component={Paper} sx={{ p: 1 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {isSmUp && <TableCell>Preview</TableCell>}
                  <TableCell>Title</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Reported By</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    {isSmUp && (
                      <TableCell>
                        <Skeleton
                          variant="rectangular"
                          width={64}
                          height={48}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Skeleton width="60%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="40%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="50%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="40%" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton width={80} height={36} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      ) : items.length === 0 ? (
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          mt={5}
        >
          No items match your search.
        </Typography>
      ) : viewMode === "grid" ? (
        /* ---------- GRID VIEW ---------- */
        <Grid
          container
          spacing={3}
          sx={{
            justifyContent: `${!isMdUp ? "center" : "left"}`,
            alignItems: "stretch",
          }}
        >
          {items.map((item) => (
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
                {item.image ? (
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
                ) : (
                  <CardMedia
                    component="img"
                    image={placeholder}
                    alt={item.title}
                    sx={{
                      height: { xs: 160, sm: 170, md: 180 },
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}

                <Chip
                  label={item.returned ? "Returned" : "Not Returned"}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    width: { xs: 90, sm: 110, md: 130 },
                    justifyContent: "center",
                    backgroundColor: getStatusColor(item.returned),
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                />

                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    noWrap
                    title={item.title}
                  >
                    {item.title}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOn
                      fontSize="small"
                      color="action"
                      sx={{ mr: 1 }}
                    />
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
                    <CalendarToday
                      fontSize="small"
                      color="action"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(
                        item.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() =>
                      navigate(`/items/${item._id}`, { state: { item } })
                    }
                  >
                    View
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        /* ---------- LIST VIEW (TABLE + PAGINATION) ---------- */
        <Box>
          <TableContainer component={Paper} sx={{ maxHeight: "65vh" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 90 }}>Preview</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Reported By</TableCell>
                  <TableCell sx={{ width: 140 }}>Date</TableCell>
                  <TableCell align="center" sx={{ width: 140 }}>
                    Status
                  </TableCell>
                  <TableCell align="right" sx={{ width: 110 }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedItems.map((item) => (
                  <TableRow key={item._id} hover>
                    <TableCell>
                      {item.image ? (
                        <Avatar
                          variant="rounded"
                          src={item.image}
                          alt={item.title}
                          sx={{ width: 64, height: 48 }}
                        />
                      ) : (
                        <Avatar
                          variant="rounded"
                          src={placeholder}
                          alt={item.title}
                          sx={{ width: 64, height: 48 }}
                        />
                      )}
                    </TableCell>

                    <TableCell
                      sx={{
                        maxWidth: 240,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <Typography noWrap sx={{ fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        {isSmUp
                          ? item.description || ""
                          : `${item.location} • ${
                              item.createdBy?.fullName || "Unknown"
                            }`}
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{
                        maxWidth: 140,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocationOn fontSize="small" color="action" />
                        <Typography noWrap color="text.secondary">
                          {item.location}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Person fontSize="small" color="action" />
                        <Typography noWrap color="text.secondary">
                          {item.createdBy?.fullName || "Unknown"}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography noWrap color="text.secondary">
                        {new Date(
                          item.createdAt || Date.now()
                        ).toLocaleDateString()}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={item.returned ? "Returned" : "Not Returned"}
                        sx={{
                          backgroundColor: getStatusColor(item.returned),
                          width: { xs: 90, sm: 110, md: 130 },
                          color: "#fff",
                          fontWeight: 700,
                          px: 1,
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      {isSmUp ? (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            navigate(`/items/${item._id}`, { state: { item } })
                          }
                        >
                          View
                        </Button>
                      ) : (
                        <Tooltip title="View details">
                          <IconButton
                            size="small"
                            onClick={() =>
                              navigate(`/items/${item._id}`, {
                                state: { item },
                              })
                            }
                          >
                            <OpenInNew />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={items.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Rows"
            sx={{
              mt: 1,
              ".MuiTablePagination-toolbar": {
                px: { xs: 1, sm: 2 },
              },
            }}
          />
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          variant="filled"
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default withHOC(homeProvider, Home);
