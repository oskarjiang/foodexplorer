import React from 'react';
import { Livsmedel } from '../types';
import LivsmedelsItem from './LivsmedelsItem';

interface LivsmedelsListProps {
  livsmedel: Livsmedel[];
  onSelectLivsmedel: (livsmedel: Livsmedel) => void;
  loading: boolean;
}

const LivsmedelsLista: React.FC<LivsmedelsListProps> = ({ livsmedel, onSelectLivsmedel, loading }) => {
  if (loading) {
    return <div className="loading">Laddar livsmedel...</div>;
  }

  if (livsmedel.length === 0) {
    return <div className="no-data">Inga livsmedel hittades</div>;
  }

  return (
    <div className="livsmedel-list">
      {livsmedel.map((item) => (
        <LivsmedelsItem 
          key={item.nummer} 
          livsmedel={item} 
          onClick={onSelectLivsmedel} 
        />
      ))}
    </div>
  );
};

export default LivsmedelsLista;
