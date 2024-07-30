import React from "react";
import "./Footer.css";
import { Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div>
        <Typography variant="body2" color="text.primary">
          &copy;2024 MovieTracker{" "}
        </Typography>
      </div>
      <div>
        <Typography variant="body2" color="text.primary">
          Made with love by Group 58 ❤️
        </Typography>
      </div>
    </footer>
  );
};

export default Footer;
