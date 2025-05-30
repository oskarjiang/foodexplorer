import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchLivsmedel, fetchLivsmedelsItem } from './services/api';
import { Livsmedel, Sprak } from './types';
import LivsmedelsLista from './components/LivsmedelsLista';
import LivsmedelsDetails from './components/LivsmedelsDetails';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { 
  Container, Box, Typography, AppBar, Toolbar, 
  Paper, Button, CircularProgress, TextField, InputAdornment,
  IconButton, Tooltip
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Import Google Fonts - Nunito
import '@fontsource/nunito/300.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/500.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';

// Create a food-themed instance
const theme = createTheme({
  palette: {
    primary: {
      light: '#66bb6a',
      main: '#4caf50', // Fresh green for healthy food
      dark: '#388e3c',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336', // Red for energy/protein
      dark: '#ba000d',
      contrastText: '#fff',
    },
    info: {
      main: '#2196f3', // Blue for water/hydration
    },
    warning: {
      main: '#ff9800', // Orange for carbohydrates
    },
    success: {
      main: '#8bc34a', // Light green for fiber
    },
    background: {
      default: '#f9f9f7', // Slightly off-white for a natural feel
      paper: '#ffffff',
    },
    text: {
      primary: '#2e3c42',
      secondary: '#546e7a',
    },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.2rem',
      fontWeight: 600,
      letterSpacing: '-0.015em',
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.4rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.2rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          backgroundImage: 'linear-gradient(to right, #43a047, #66bb6a)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
});

function App() {
  const [livsmedelsLista, setLivsmedelsLista] = useState<Livsmedel[]>([]);
  const [selectedLivsmedel, setSelectedLivsmedel] = useState<Livsmedel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [limit] = useState<number>(20);
  const [sprak] = useState<Sprak>(Sprak.Svenska);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      // Reset to first page when searching
      if (offset !== 0) {
        setOffset(0);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const loadLivsmedel = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchLivsmedel(offset, limit, sprak, debouncedSearchQuery);
        setLivsmedelsLista(data.livsmedel);
      } catch (err) {
        setError('Kunde inte hämta livsmedel. Vänligen försök igen senare.');
        console.error('Error loading livsmedel:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLivsmedel();
  }, [offset, limit, sprak, debouncedSearchQuery]);

  const handleSelectLivsmedel = async (livsmedel: Livsmedel) => {
    setLoading(true);
    try {
      // Fetch more detailed information about the selected item
      const detailedLivsmedel = await fetchLivsmedelsItem(livsmedel.nummer, sprak);
      setSelectedLivsmedel(detailedLivsmedel);
    } catch (err) {
      setError(`Kunde inte hämta detaljer för ${livsmedel.namn}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    setOffset(offset + limit);
  };

  const handlePreviousPage = () => {
    if (offset >= limit) {
      setOffset(offset - limit);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App">
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <RestaurantMenuIcon sx={{ mr: 2, fontSize: '2rem' }} />
            <Typography variant="h1" component="h1" sx={{ flexGrow: 1 }}>
              Livsmedelsdatabasen
            </Typography>
            <Tooltip title="Livsmedelsverkets databas innehåller näringsinnehåll för livsmedel">
              <IconButton color="inherit" size="small">
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
          {error && (
            <Box 
              sx={{ 
                bgcolor: 'error.light', 
                color: 'error.dark', 
                p: 2, 
                borderRadius: 1,
                mb: 2 
              }}
            >
              <Typography>{error}</Typography>
            </Box>
          )}
          
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
              gap: 3
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Paper 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  borderRadius: 2,
                  backgroundImage: 'linear-gradient(to right bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url("/food-pattern-bg.png")',
                  backgroundSize: 'cover',
                  boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)'
                }}
              >
                <Typography 
                  variant="h6" 
                  component="h3" 
                  gutterBottom 
                  sx={{ 
                    color: 'primary.dark',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    mb: 1
                  }}
                >
                  Hitta livsmedel
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="t.ex. äpple, bröd, mjölk..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 3,
                      backgroundColor: 'white',
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.25)'
                      }
                    }
                  }}
                />
              </Paper>
              
              <LivsmedelsLista 
                livsmedel={livsmedelsLista} 
                onSelectLivsmedel={handleSelectLivsmedel} 
                loading={loading}
                selectedLivsmedel={selectedLivsmedel}
              />
              
              <Box 
                sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 2,
                  mt: 2
                }}
              >
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(76, 175, 80, 0.2)'
                  }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={handlePreviousPage} 
                      disabled={offset === 0 || loading}
                      startIcon={<NavigateBeforeIcon />}
                      size="small"
                      sx={{ 
                        borderRadius: 2,
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)'
                        }
                      }}
                    >
                      Föregående
                    </Button>
                    
                    <Box 
                      sx={{ 
                        px: 2, 
                        py: 0.5, 
                        borderRadius: 2, 
                        backgroundColor: 'primary.light', 
                        color: 'white',
                        fontWeight: 600,
                        minWidth: '60px',
                        textAlign: 'center'
                      }}
                    >
                      {Math.floor(offset / limit) + 1}
                    </Box>
                    
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={handleNextPage} 
                      disabled={loading}
                      endIcon={<NavigateNextIcon />}
                      size="small"
                      sx={{ 
                        borderRadius: 2,
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)'
                        }
                      }}
                    >
                      Nästa
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Box>
            
            <Box>
              <LivsmedelsDetails livsmedel={selectedLivsmedel} />
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
