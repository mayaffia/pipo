import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Box, Typography, Paper, Alert, Fade } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { LoginHeader, LoginForm } from "./components";
import styles from "./LoginPage.module.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={styles.loginPage}>
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper elevation={10} className={styles.loginPaper}>
            <LoginHeader />

            {error && (
              <Fade in>
                <Alert severity="error" className={styles.loginAlert}>
                  {error}
                </Alert>
              </Fade>
            )}

            <LoginForm
              email={email}
              password={password}
              showPassword={showPassword}
              loading={loading}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              onSubmit={handleSubmit}
            />

            <Box className={styles.loginFooter}>
              <Link to="/register" className={styles.loginLinkWrapper}>
                <Typography variant="body2" className={styles.loginLink}>
                  Don't have an account? Sign Up
                </Typography>
              </Link>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default LoginPage;
