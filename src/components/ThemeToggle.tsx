import { Brightness4, Brightness7 } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";

import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton onClick={toggleTheme} color='inherit'>
      {theme === "light" ? <Brightness4 /> : <Brightness7 />}
    </IconButton>
  );
};

export default ThemeToggle;
