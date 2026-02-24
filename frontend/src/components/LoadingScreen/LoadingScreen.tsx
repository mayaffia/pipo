import React from "react";
import { Container, Box, Typography } from "@mui/material";
import styles from "./LoadingScreen.module.css";

export const LoadingScreen: React.FC = () => {
  return (
    <Container>
      <Box className={styles.loadingScreen}>
        <Typography variant="h5" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    </Container>
  );
};
