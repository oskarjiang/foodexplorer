import React from 'react';
import { Livsmedel } from '../types';
import { 
  Card, CardContent, Typography, 
  CardActionArea, Box, Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface LivsmedelsItemProps {
  livsmedel: Livsmedel;
  onClick?: (livsmedel: Livsmedel) => void;
  isSelected?: boolean;
}

const StyledCard = styled(Card, { 
  shouldForwardProp: (prop) => prop !== 'isSelected' 
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  marginBottom: theme.spacing(1),
  transition: 'all 0.2s ease-in-out',
  borderLeft: isSelected ? `4px solid ${theme.palette.primary.main}` : 'none',
  backgroundColor: isSelected ? theme.palette.action.selected : theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[3],
  }
}));

const LivsmedelsItem: React.FC<LivsmedelsItemProps> = ({ livsmedel, onClick, isSelected = false }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(livsmedel);
    }
  };

  return (
    <StyledCard isSelected={isSelected}>
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom>
            {livsmedel.namn}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              ID: {livsmedel.nummer}
            </Typography>
            
            {livsmedel.livsmedelsgrupp && (
              <Chip 
                label={livsmedel.livsmedelsgrupp} 
                size="small" 
                variant="outlined" 
                sx={{ ml: 1 }}
              />
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
};

export default LivsmedelsItem;
