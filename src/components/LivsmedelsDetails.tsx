import React, { useState, useEffect, useRef } from 'react';
import { Livsmedel, Naringsvarde, Sprak } from '../types';
import { fetchNaringsvarden } from '../services/api';
import { 
  Card, CardContent, Typography, Grid, Paper, Box,
  Skeleton, CircularProgress, Alert, Fade,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface LivsmedelsDetailsProps {
  livsmedel: Livsmedel | null;
}

const LivsmedelsDetails: React.FC<LivsmedelsDetailsProps> = ({ livsmedel }) => {
  const [macroNutrients, setMacroNutrients] = useState<Naringsvarde[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const previousLivsmedel = useRef<Livsmedel | null>(null);
  const previousNutrients = useRef<Naringsvarde[]>([]);

  useEffect(() => {
    if (livsmedel && (!previousLivsmedel.current || previousLivsmedel.current.nummer !== livsmedel.nummer)) {
      // Save current data as previous data
      if (previousLivsmedel.current && macroNutrients.length > 0) {
        previousNutrients.current = macroNutrients;
      }
      
      // Start fade out
      setFadeState('out');
      
      // Set a small delay before starting to load
      const loadTimer = setTimeout(() => {
        loadMacroNutrients();
      }, 100);
      
      return () => clearTimeout(loadTimer);
    }
  }, [livsmedel]);

  const loadMacroNutrients = async () => {
    if (!livsmedel) return;
    
    previousLivsmedel.current = livsmedel;
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const data = await fetchNaringsvarden(livsmedel.nummer, Sprak.Svenska);
      
      // Start fade in with new data
      setMacroNutrients(data);
      setFadeState('in');
    } catch (err) {
      setErrorMessage('Kunde inte hämta näringsvärden.');
      console.error(`Error fetching nutritional values:`, err);
    } finally {
      setIsLoading(false);
    }
  };
  if (!livsmedel) {
    return <div className="livsmedel-details">Ingen livsmedel vald</div>;
  }

  // Find key macronutrients
  const findNutrient = (code: string) => {
    return macroNutrients.find(n => n.euroFIRkod === code);
  };

  const energy = findNutrient('ENERC');
  const protein = findNutrient('PROT');
  const fat = findNutrient('FAT');
  const carbs = findNutrient('CHO');
  const fiber = findNutrient('FIBT');  // Styled Card component for consistent macro nutrient cards
  const MacroCard = styled(Card)(({ theme }) => ({
    height: '100%',
    textAlign: 'center',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
  }));

  const renderNutrientCards = (nutrients: Naringsvarde[]) => {
    // Find key macronutrients
    const findNutrient = (code: string) => {
      return nutrients.find(n => n.euroFIRkod === code);
    };

    const energy = findNutrient('ENERC');
    const protein = findNutrient('PROT');
    const fat = findNutrient('FAT');
    const carbs = findNutrient('CHO');
    const fiber = findNutrient('FIBT');

    const macroNutrients = [
      { name: 'Energi', value: energy, unit: 'kcal' },
      { name: 'Protein', value: protein, unit: 'g' },
      { name: 'Fett', value: fat, unit: 'g' },
      { name: 'Kolhydrater', value: carbs, unit: 'g' },
      { name: 'Fiber', value: fiber, unit: 'g' },
    ];    return (
      <Grid container spacing={2}>
        {macroNutrients.map((nutrient, index) => (
          <Box key={index} sx={{ width: { xs: '50%', sm: '33.33%', md: '20%' }, padding: 1 }}>
            <MacroCard elevation={2}>
              <CardContent>
                <Typography variant="h6" component="h4" gutterBottom>
                  {nutrient.name}
                </Typography>
                {nutrient.value ? (
                  <Typography variant="h5" color="primary">
                    {nutrient.value.varde} {nutrient.value.enhet || nutrient.unit}
                  </Typography>
                ) : (
                  <Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto' }} />
                )}
              </CardContent>
            </MacroCard>
          </Box>
        ))}
      </Grid>
    );
  };
  const renderNutrientTable = (nutrients: Naringsvarde[]) => {
    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small" aria-label="nutrients table">
          <TableHead>
            <TableRow>
              <TableCell>Näringsämne</TableCell>
              <TableCell>Värde</TableCell>
              <TableCell>Enhet</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nutrients.length > 0 ? (
              nutrients.map((naringsvarde: Naringsvarde, index: number) => (
                <TableRow key={index}>
                  <TableCell>{naringsvarde.namn}</TableCell>
                  <TableCell>{naringsvarde.varde}</TableCell>
                  <TableCell>{naringsvarde.enhet || ''}</TableCell>
                </TableRow>
              ))
            ) : (
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" width="100%" /></TableCell>
                  <TableCell><Skeleton variant="text" width="50%" /></TableCell>
                  <TableCell><Skeleton variant="text" width="30%" /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>      </TableContainer>
    );
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        position: 'relative', 
        borderRadius: 2, 
        overflow: 'hidden' 
      }}
    >
      <Typography variant="h4" component="h2" gutterBottom>
        {livsmedel.namn}
      </Typography>
      
      <Typography variant="body1" gutterBottom>
        ID: {livsmedel.nummer}
      </Typography>
      
      {livsmedel.livsmedelsgrupp && (
        <Typography variant="body1" gutterBottom>
          Grupp: {livsmedel.livsmedelsgrupp}
        </Typography>
      )}
      
      <Fade in={fadeState === 'in'} timeout={300}>
        <div>
          {errorMessage ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          ) : (
            <>
              <Typography variant="h5" component="h3" sx={{ mt: 3, mb: 2 }}>
                Makronäringsvärden (per 100g):
              </Typography>
              {renderNutrientCards(macroNutrients)}
              
              <Typography variant="h5" component="h3" sx={{ mt: 4, mb: 2 }}>
                Detaljerade näringsvärden:
              </Typography>
              {renderNutrientTable(macroNutrients)}
            </>
          )}
        </div>
      </Fade>
      
      {isLoading && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1
        }}>
          <CircularProgress />
        </div>
      )}
    </Paper>
  );
};

export default LivsmedelsDetails;
