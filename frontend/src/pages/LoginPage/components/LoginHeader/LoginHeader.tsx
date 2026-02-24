import React from "react";
import { Box, Typography } from "@mui/material";
import { Login as LoginIcon } from "@mui/icons-material";
import styles from "./LoginHeader.module.css";

export const LoginHeader: React.FC = () => {
  return (
    <Box className={styles.headerBox}>
      <Typography component="h1" variant="h4" className={styles.title}>
        Welcome Back
      </Typography>
      <Typography variant="body1" className={styles.subtitle}>
        Sign in to continue to your account
      </Typography>
    </Box>
  );
};
