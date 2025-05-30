import React, { useState, useEffect, useRef } from 'react';
import { Livsmedel, Naringsvarde, Sprak } from '../types';
import { fetchNaringsvarden } from '../services/api';

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
  const fiber = findNutrient('FIBT');
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

    return (
      <div className="macro-nutrients">
        <div className="macro-nutrient">
          <h4>Energi</h4>
          {energy ? (
            <p>{energy.varde} {energy.enhet || 'kcal'}</p>
          ) : (
            <p className="skeleton-text">&nbsp;</p>
          )}
        </div>
        <div className="macro-nutrient">
          <h4>Protein</h4>
          {protein ? (
            <p>{protein.varde} {protein.enhet || 'g'}</p>
          ) : (
            <p className="skeleton-text">&nbsp;</p>
          )}
        </div>
        <div className="macro-nutrient">
          <h4>Fett</h4>
          {fat ? (
            <p>{fat.varde} {fat.enhet || 'g'}</p>
          ) : (
            <p className="skeleton-text">&nbsp;</p>
          )}
        </div>
        <div className="macro-nutrient">
          <h4>Kolhydrater</h4>
          {carbs ? (
            <p>{carbs.varde} {carbs.enhet || 'g'}</p>
          ) : (
            <p className="skeleton-text">&nbsp;</p>
          )}
        </div>
        <div className="macro-nutrient">
          <h4>Fiber</h4>
          {fiber ? (
            <p>{fiber.varde} {fiber.enhet || 'g'}</p>
          ) : (
            <p className="skeleton-text">&nbsp;</p>
          )}
        </div>
      </div>
    );
  };

  const renderNutrientTable = (nutrients: Naringsvarde[]) => {
    return (
      <table className="nutrients-table">
        <thead>
          <tr>
            <th>Näringsämne</th>
            <th>Värde</th>
            <th>Enhet</th>
          </tr>
        </thead>
        <tbody>
          {nutrients.length > 0 ? (
            nutrients.map((naringsvarde: Naringsvarde, index: number) => (
              <tr key={index}>
                <td>{naringsvarde.namn}</td>
                <td>{naringsvarde.varde}</td>
                <td>{naringsvarde.enhet || ''}</td>
              </tr>
            ))
          ) : (
            Array.from({ length: 10 }).map((_, index) => (
              <tr key={index} className="skeleton-row">
                <td><div className="skeleton-text">&nbsp;</div></td>
                <td><div className="skeleton-text">&nbsp;</div></td>
                <td><div className="skeleton-text">&nbsp;</div></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  };

  return (
    <div className="livsmedel-details">
      <h2>{livsmedel.namn}</h2>
      <p>ID: {livsmedel.nummer}</p>
      {livsmedel.livsmedelsgrupp && <p>Grupp: {livsmedel.livsmedelsgrupp}</p>}
      
      <div className={`content-container ${fadeState} ${isLoading ? 'loading' : ''}`}>
        {errorMessage ? (
          <div className="error">{errorMessage}</div>
        ) : (
          <>
            <h3>Makronäringsvärden (per 100g):</h3>
            {renderNutrientCards(macroNutrients)}
            
            <h3>Detaljerade näringsvärden:</h3>
            {renderNutrientTable(macroNutrients)}
          </>
        )}
      </div>
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default LivsmedelsDetails;
