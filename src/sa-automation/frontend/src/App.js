import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Container, Tabs, Tab, Box, Stepper, Step, StepLabel } from "@mui/material";
import UploadPage from "./modules/uploadPage";
import ValidatedQA from "./modules/qualityAttributes";
import SISCalculator from "./modules/sisCalculator";
import DesignDecisions from "./modules/designDecisions";

const steps = [
  "Upload Document",
  "Extract Quality Attributes",
  "Validate & Edit QAs",
  "Extract Design Decisions",
  "SIS Calculator"
];
function Home() {
  return (
    <Container sx={{ mt: 12 }}>
      <Typography variant="h4" gutterBottom align="center">
        Software Architecture Assessment Tool
      </Typography>

      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        This tool assists in semi-automated evaluation of software architecture using LLMs.
        It supports quality attribute extraction, design decision extraction, sustainability dimension mapping and SIS calculation.
      </Typography>

      <Stepper alternativeLabel activeStep={-1} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Container>
  );
}

function AppHeader() {
  const location = useLocation();
  const current = location.pathname;

  return (
    <AppBar position="fixed" color="primary" elevation={2}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          SA Assessment Tool
        </Typography>
        <Tabs
          value={current}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            
            "& .MuiTab-root": { fontWeight: 500, mx: 1 },
          }}
        >
          <Tab label="Home" value="/" to="/" component={Link} />
          <Tab label="Upload" value="/upload" to="/upload" component={Link} />
          <Tab label="Quality Attributes" value="/qas" to="/qas" component={Link} />
          <Tab label="Design Decisions" value="/decisions" to="/decisions" component={Link} />
          <Tab label="SIS Calculator" value="/sis" to="/sis" component={Link} />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}


export default function App() {
  return (
    <Router>
      <AppHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/qas" element={<ValidatedQA />} />
        <Route path="/decisions" element={<DesignDecisions />} />
        <Route path="/sis" element={<SISCalculator />} />
      </Routes>
    </Router>
  );
}
