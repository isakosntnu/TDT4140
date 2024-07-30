import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api/authService";
import SignUpForm from "../components/SignUpForm";

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!formData.username || !formData.password || !formData.confirmPassword){
      setError("Please ensure all fields are filled out before proceeding");
      return;
    }


    const { confirmPassword, ...userData } = formData;
    const result = await signupUser(userData);
    if (result.success) {
      navigate("/login");
    } else {
      setError(result.error);
    }
  };
  
  const handleLogInClick = () => {
    navigate("/login")
  };



  return (
    <SignUpForm
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      formData={formData}
      error={error}
      onLogInClick = {handleLogInClick}

    />
  );
};

export default SignUpPage;
