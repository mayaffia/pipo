import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Box, Typography, Paper, Alert, Fade } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { RegisterHeader, RegisterForm } from "./components";
import styles from "./RegisterPage.module.css";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={styles.registerPage}>
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper elevation={10} className={styles.registerPaper}>
            <RegisterHeader />

            {error && (
              <Fade in>
                <Alert severity="error" className={styles.registerAlert}>
                  {error}
                </Alert>
              </Fade>
            )}

            <RegisterForm
              formData={formData}
              showPassword={showPassword}
              loading={loading}
              onChange={handleChange}
              onTogglePassword={() => setShowPassword(!showPassword)}
              onSubmit={handleSubmit}
            />

            <Box className={styles.registerFooter}>
              <Link to="/login" className={styles.registerLinkWrapper}>
                <Typography variant="body2" className={styles.registerLink}>
                  Already have an account? Sign In
                </Typography>
              </Link>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default RegisterPage;
