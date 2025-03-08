import { Box, Container, CssBaseline } from "@mui/material";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import LanguageSelector from "./components/LanguageSelector";
import ThemeToggle from "./components/ThemeToggle";
import FormPage from "./pages/FormPage";
import Home from "./pages/Home";
import SubmissionsPage from "./pages/SubmissionsPage";

const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <Container>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ThemeToggle />
          <LanguageSelector />
        </Box>

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/form' element={<FormPage />} />
          <Route path='/submissions' element={<SubmissionsPage />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
