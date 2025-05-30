import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchLivsmedel, fetchLivsmedelsItem } from './services/api';
import { Livsmedel, Sprak } from './types';
import LivsmedelsLista from './components/LivsmedelsLista';
import LivsmedelsDetails from './components/LivsmedelsDetails';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { 
  Container, Box, Typography, AppBar, Toolbar, 
  Paper, Button, CircularProgress, TextField, InputAdornment
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SearchIcon from '@mui/icons-material/Search';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#4285f4',
    },
    secondary: {
      main: '#34a853',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.2rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
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
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h1" component="h1" sx={{ flexGrow: 1 }}>
              Livsmedelsdatabasen
            </Typography>
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
              <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Sök livsmedel"
                  placeholder="t.ex. äpple, bröd, mjölk..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
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
                <Paper elevation={1} sx={{ p: 1, borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={handlePreviousPage} 
                      disabled={offset === 0 || loading}
                      startIcon={<NavigateBeforeIcon />}
                      size="small"
                    >
                      Föregående
                    </Button>
                    
                    <Typography variant="body2">
                      Sida {Math.floor(offset / limit) + 1}
                    </Typography>
                    
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={handleNextPage} 
                      disabled={loading}
                      endIcon={<NavigateNextIcon />}
                      size="small"
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
