import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import BrowseMovies from "./pages/BrowseMovies";
import PrivateRoute from "./components/PrivateRoute";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Redirect from / to /home when the user is authenticated */}
            <Route
              path="/"
              element={<PrivateRoute element={<Navigate to="/home" replace />} />} // Pass an empty object for MovieDetailModalProps
            />
            <Route
              path="/home"
              element={<PrivateRoute element={<HomePage />} />} // Pass an empty object for MovieDetailModalProps
            />
            <Route
              path="/profile"
              element={<PrivateRoute element={<ProfilePage />} />} // Pass an empty object for MovieDetailModalProps
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/movies"
              element={<PrivateRoute element={<BrowseMovies />} />} // Pass an empty object for MovieDetailModalProps
            />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
