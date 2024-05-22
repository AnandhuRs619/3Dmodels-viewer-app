import { DashboardPage } from "./pages/DashboardPage"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a custom theme with overrides
const theme = createTheme({
  components: {
    // Override the default margin for all components
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          // Remove margin from all components
          '*': {
            margin: 0,
          },
        },
      },
    },
  },
});

function App() {
 
  return (
    <>
     <ThemeProvider theme={theme}>
      <CssBaseline />
    <DashboardPage/>
    </ThemeProvider>
    </>
  )
}

export default App
