import React, { useState, useEffect } from 'react';
import { Livsmedel, Naringsvarde, Sprak } from '../types';
import { fetchNaringsvarden } from '../services/api';

interface LivsmedelsDetailsProps {
  livsmedel: Livsmedel | null;
}

const LivsmedelsDetails: React.FC<LivsmedelsDetailsProps> = ({ livsmedel }) => {
  const [macroNutrients, setMacroNutrients] = useState<Naringsvarde[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadMacroNutrients = async () => {
      if (!livsmedel) return;
      
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await fetchNaringsvarden(livsmedel.nummer, Sprak.Svenska);
        setMacroNutrients(data);
      } catch (err) {
        setErrorMessage('Kunde inte hämta näringsvärden.');
        console.error(`Error fetching nutritional values:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMacroNutrients();
  }, [livsmedel]);
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

  return (
    <div className="livsmedel-details">
      <h2>{livsmedel.namn}</h2>
      <p>ID: {livsmedel.nummer}</p>
      {livsmedel.livsmedelsgrupp && <p>Grupp: {livsmedel.livsmedelsgrupp}</p>}
      
      {isLoading ? (
        <div className="loading">Laddar näringsvärden...</div>
      ) : errorMessage ? (
        <div className="error">{errorMessage}</div>
      ) : (
        <>
          <h3>Makronäringsvärden (per 100g):</h3>
          <div className="macro-nutrients">
            {energy && (
              <div className="macro-nutrient">
                <h4>Energi</h4>
                <p>{energy.varde} {energy.enhet || 'kcal'}</p>
              </div>
            )}
            {protein && (
              <div className="macro-nutrient">
                <h4>Protein</h4>
                <p>{protein.varde} {protein.enhet || 'g'}</p>
              </div>
            )}
            {fat && (
              <div className="macro-nutrient">
                <h4>Fett</h4>
                <p>{fat.varde} {fat.enhet || 'g'}</p>
              </div>
            )}
            {carbs && (
              <div className="macro-nutrient">
                <h4>Kolhydrater</h4>
                <p>{carbs.varde} {carbs.enhet || 'g'}</p>
              </div>
            )}
            {fiber && (
              <div className="macro-nutrient">
                <h4>Fiber</h4>
                <p>{fiber.varde} {fiber.enhet || 'g'}</p>
              </div>
            )}
          </div>
          
          <h3>Detaljerade näringsvärden:</h3>
          <table className="nutrients-table">
            <thead>
              <tr>
                <th>Näringsämne</th>
                <th>Värde</th>
                <th>Enhet</th>
              </tr>
            </thead>
            <tbody>
              {macroNutrients.map((naringsvarde: Naringsvarde, index: number) => (
                <tr key={index}>
                  <td>{naringsvarde.namn}</td>
                  <td>{naringsvarde.varde}</td>
                  <td>{naringsvarde.enhet || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default LivsmedelsDetails;
