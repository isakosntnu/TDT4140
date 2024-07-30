// LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authService";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/LoginForm"; 

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await loginUser(credentials);
    if (response.success) {
      login(response.data.user); 
      navigate("/home");
    } else {
      setError(response.error.message);
    }
  };
  const handleSignUpClick = () => {
    navigate("/signup")
  };

  return (
    <LoginForm
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      credentials={credentials}
      error={error}
      onSignUpClick = {handleSignUpClick}
    />
  );
};

export default LoginPage;
