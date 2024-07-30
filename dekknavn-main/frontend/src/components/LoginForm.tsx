// LoginForm.tsx
import React from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import "../css/LoginForm.css";

import { LoginFormProps } from "../types";

const LoginForm: React.FC<LoginFormProps> = ({
  handleSubmit,
  handleChange,
  credentials,
  error,
  onSignUpClick,
}) => {
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="loginFormContainer"
    >
      <Typography
        variant="h4"
        sx={{
          color: "#fff",
          marginBottom: "2rem",
          fontWeight: "bold",
          fontSize: 40,
        }}
      >
        Login
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        label="Username"
        name="username"
        value={credentials.username}
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
        label="Password"
        name="password"
        type="password"
        value={credentials.password}
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
        Log In
      </Button>
      <Link
        href="#"
        variant="body2"
        sx={{ color: "white", mt: 2 }}
      >
        Forgot password?
      </Link>
      <Link
        href="#"
        variant="body2"
        sx={{ color: "white", mt: 1 }}
        onClick={(e) => {
          e.preventDefault();
          onSignUpClick();
        }}
      >
        Don't have an account? Sign Up
      </Link>
    </Box>
  );
};

export default LoginForm;
