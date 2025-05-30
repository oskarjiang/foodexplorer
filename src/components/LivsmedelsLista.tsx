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
}) => {  if (loading && livsmedel.length === 0) {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          borderRadius: 2,
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'linear-gradient(to right, #66bb6a, #4caf50)',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              color: 'primary.dark',
              fontWeight: 600,
              flexGrow: 1,
              mb: 0
            }}
          >
            Livsmedel
          </Typography>
        </Box>
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
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'linear-gradient(to right, #66bb6a, #4caf50)',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              color: 'primary.dark',
              fontWeight: 600,
              flexGrow: 1,
              mb: 0
            }}
          >
            Livsmedel
          </Typography>
        </Box>
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
          overflow: 'auto',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'linear-gradient(to right, #66bb6a, #4caf50)',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              color: 'primary.dark',
              fontWeight: 600,
              flexGrow: 1,
              mb: 0
            }}
          >
            Livsmedel
          </Typography>
        </Box>
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
