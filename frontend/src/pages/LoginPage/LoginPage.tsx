import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Paper, Alert, Fade } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { LoginHeader, LoginForm } from "./components";
import { validateEmail } from "../../utils/validation";
import styles from "./LoginPage.module.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (fieldErrors.email) {
      setFieldErrors({ ...fieldErrors, email: "" });
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (fieldErrors.password) {
      setFieldErrors({ ...fieldErrors, password: "" });
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      email: "",
      password: "",
    };

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error || "";
    }

    // Validate password
    if (!password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);

    // Return true if no errors
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

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
              fieldErrors={fieldErrors}
              onEmailChange={handleEmailChange}
              onPasswordChange={handlePasswordChange}
              onTogglePassword={() => setShowPassword(!showPassword)}
              onSubmit={handleSubmit}
            />
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default LoginPage;
