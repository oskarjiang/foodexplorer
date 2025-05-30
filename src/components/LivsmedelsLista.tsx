import React from 'react';
import { Livsmedel } from '../types';
import LivsmedelsItem from './LivsmedelsItem';

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
      <div className="livsmedel-list-skeleton">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="livsmedel-item-skeleton"></div>
        ))}
      </div>
    );
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
          isSelected={selectedLivsmedel?.nummer === item.nummer}
        />
      ))}
    </div>
  );
};

export default LivsmedelsLista;
