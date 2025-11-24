// src/components/Footer/Footer.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position:"sticky",
        bottom:"0",
        width: "100%",
        py: 2.5,
        mt: "auto",
        textAlign: "center",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} <strong>Find It Hub</strong>. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
