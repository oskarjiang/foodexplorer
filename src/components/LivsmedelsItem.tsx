import React from 'react';
import { Livsmedel } from '../types';

interface LivsmedelsItemProps {
  livsmedel: Livsmedel;
  onClick?: (livsmedel: Livsmedel) => void;
}

const LivsmedelsItem: React.FC<LivsmedelsItemProps> = ({ livsmedel, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(livsmedel);
    }
  };

  return (
    <div className="livsmedel-item" onClick={handleClick}>
      <h3>{livsmedel.namn}</h3>
      <p>ID: {livsmedel.nummer}</p>
      {livsmedel.livsmedelsgrupp && <p>Grupp: {livsmedel.livsmedelsgrupp}</p>}
    </div>
  );
};

export default LivsmedelsItem;
