import React from "react";
import { Container, Box, Typography } from "@mui/material";
import "./LoadingScreen.css";

export const LoadingScreen: React.FC = () => {
  return (
    <Container>
      <Box className="loading-screen">
        <Typography variant="h5" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    </Container>
  );
};
