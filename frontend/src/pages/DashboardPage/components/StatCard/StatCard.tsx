import React from "react";
import { Card, CardContent, Typography, Box, Fade } from "@mui/material";
import styles from "./StatCard.module.css";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  index: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  bgGradient,
  index,
}) => {
  return (
    <Fade in timeout={500 + index * 100}>
      <Card elevation={3} className={styles.statCard}>
        <CardContent className={styles.statCardContent}>
          <Box className={styles.statIconWrapper}>
            <Box
              className={styles.statIconBox}
              style={{ background: bgGradient }}
            >
              {icon}
            </Box>
          </Box>
          <Typography
            variant="h3"
            className={styles.statValue}
            style={{ color }}
          >
            {value}
          </Typography>
          <Typography variant="body1" className={styles.statTitle}>
            {title}
          </Typography>
        </CardContent>
      </Card>
    </Fade>
  );
};
