// ### With help from ChatGPT


// api/authService.js
import { SignUpData, UserCredentials } from "../types";
import apiCall from "./apiUtils"; 

// Function for user signup
export const signupUser = async (userData: SignUpData) => {
  try {
    const response = await apiCall("register/", "POST", userData);
    return { success: true, data: response }; 
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data || "An error occurred during registration.",
    };
  }
};


// Function for user login
export const loginUser = async (credentials: UserCredentials) => {
  try {
    const response = await apiCall("login/", "POST", credentials);
    return { success: true, data: response };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data ||
        "Failed to log in. Please check your username and password.",
    };
  }
};

