import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Paper, Alert, Fade } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { RegisterHeader, RegisterForm } from "./components";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../../utils/validation";
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
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: "",
      });
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    };

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error || "";
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error || "";
    }

    const firstNameValidation = validateName(formData.firstName, "First name");
    if (!firstNameValidation.isValid) {
      errors.firstName = firstNameValidation.error || "";
    }

    const lastNameValidation = validateName(formData.lastName, "Last name");
    if (!lastNameValidation.isValid) {
      errors.lastName = lastNameValidation.error || "";
    }

    setFieldErrors(errors);

    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

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
              fieldErrors={fieldErrors}
              onChange={handleChange}
              onTogglePassword={() => setShowPassword(!showPassword)}
              onSubmit={handleSubmit}
            />
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default RegisterPage;
