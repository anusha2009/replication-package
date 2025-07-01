import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#357a38", 
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#357a38", 
    },
    background: {
      default: "#f9f9f9", 
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#555555"
    }
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    fontSize: 15,
    h5: {
      fontWeight: 600,
      letterSpacing: "0.3px"
    },
    body1: {
      lineHeight: 1.6
    }
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 6,
          fontWeight: 500
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)"
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#357a38",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }
      }
    },
    MuiStepIcon: {
        styleOverrides: {
          root: {
            color: "#357a38", 
            "&.Mui-active": {
              color: "#66bb6a"
            },
            "&.Mui-completed": {
              color: "#388e3c"
            }
          }
        }
    }
  }
});

export default theme;
