import React from 'react';
import { Livsmedel } from '../types';
import LivsmedelsItem from './LivsmedelsItem';
import { 
  Box, Typography, Paper, Skeleton, 
  Alert, Fade, Divider
} from '@mui/material';

interface LivsmedelsListProps {
  livsmedel: Livsmedel[];
  onSelectLivsmedel: (livsmedel: Livsmedel) => void;
  loading: boolean;
  selectedLivsmedel?: Livsmedel | null;
}

const LivsmedelsLista: React.FC<LivsmedelsListProps> = ({ 
  livsmedel, 
  onSelectLivsmedel, 
  loading,
  selectedLivsmedel 
}) => {
  if (loading && livsmedel.length === 0) {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          borderRadius: 2,
          height: '100%' 
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Livsmedel
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mt: 2 }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={80}
              sx={{ mb: 1, borderRadius: 1 }}
              animation="wave"
            />
          ))}
        </Box>
      </Paper>
    );
  }

  if (livsmedel.length === 0) {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          borderRadius: 2,
          height: '100%' 
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Livsmedel
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Alert severity="info">Inga livsmedel hittades</Alert>
      </Paper>
    );
  }

  return (
    <Fade in={true} timeout={500}>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          borderRadius: 2,
          height: '100%',
          overflow: 'auto'
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Livsmedel
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mt: 2 }}>
          {livsmedel.map((item) => (
            <LivsmedelsItem 
              key={item.nummer} 
              livsmedel={item} 
              onClick={onSelectLivsmedel}
              isSelected={selectedLivsmedel?.nummer === item.nummer}
            />
          ))}
        </Box>
      </Paper>
    </Fade>
  );
};

export default LivsmedelsLista;
