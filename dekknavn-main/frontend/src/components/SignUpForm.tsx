// SignUpForm.tsx
// With help from ChatGPT
import React from "react";
import { Box, Typography, TextField, Button, Link } from "@mui/material";
import "../css/SignUpForm.css";

import { SignUpFormProps } from "../types";

const SignUpForm: React.FC<SignUpFormProps> = ({

  handleSubmit,
  handleChange,
  formData,
  error,
  onLogInClick,
}) => {
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      className="signUpFormContainer"
    >
      <Typography
        component="h1"
        variant="h4"
        sx={{
          color: "#fff",
          marginBottom: "2rem",
          fontWeight: "bold",
          fontSize: 40,
        }}
      >
        Sign Up
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={formData.username}
        onChange={handleChange}
        variant="filled"
        InputProps={{
          style: { color: "white" },
        }}
        InputLabelProps={{
          style: { color: "white" },
        }}
        className="textField"
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
        value={formData.password}
        onChange={handleChange}
        variant="filled"
        InputProps={{
          style: { color: "white" },
        }}
        InputLabelProps={{
          style: { color: "white" }, 
        }}
        className="textField"
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        id="confirm-password"
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={handleChange}
        variant="filled"
        InputProps={{
          style: { color: "white" },
        }}
        InputLabelProps={{
          style: { color: "white" }, 
        }}
        className="textField"
      />
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          mt: 3,
          mb: 2,
          background: "rgba(255, 255, 255, 0.3)", 
          color: "white",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.45)", 
          },
          width: "75%", 
          maxWidth: "350px", 
        }}
      >
        Sign Up
      </Button>
      <Link
        href="#"
        variant="body2"
        sx={{ color: "white", mt: 1 }}
        onClick={(e) => {
          e.preventDefault(); 
          onLogInClick(); 
        }}
      >
        Already have an account? Log in
      </Link>
    </Box>
  );
};

export default SignUpForm;
