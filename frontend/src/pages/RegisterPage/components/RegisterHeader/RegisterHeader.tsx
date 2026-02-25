import React from "react";
import { Box, Typography } from "@mui/material";
import styles from "./RegisterHeader.module.css";

export const RegisterHeader: React.FC = () => {
  return (
    <Box className={styles.headerBox}>
      <Typography component="h1" variant="h4" className={styles.title}>
        Create Account
      </Typography>
      <Typography variant="body1" className={styles.subtitle}>
        Sign up to get started with your tasks
      </Typography>
    </Box>
  );
};
