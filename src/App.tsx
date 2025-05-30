import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchLivsmedel, fetchLivsmedelsItem } from './services/api';
import { Livsmedel, Sprak } from './types';
import LivsmedelsLista from './components/LivsmedelsLista';
import LivsmedelsDetails from './components/LivsmedelsDetails';

function App() {
  const [livsmedelsLista, setLivsmedelsLista] = useState<Livsmedel[]>([]);
  const [selectedLivsmedel, setSelectedLivsmedel] = useState<Livsmedel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [limit] = useState<number>(20);
  const [sprak] = useState<Sprak>(Sprak.Svenska);

  useEffect(() => {
    const loadLivsmedel = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchLivsmedel(offset, limit, sprak);
        setLivsmedelsLista(data.livsmedel);
      } catch (err) {
        setError('Kunde inte hämta livsmedel. Vänligen försök igen senare.');
        console.error('Error loading livsmedel:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLivsmedel();
  }, [offset, limit, sprak]);

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Livsmedelsdatabasen</h1>
      </header>
      
      <main className="App-content">
        {error && <div className="error">{error}</div>}
        
        <div className="content-container">
          <div className="list-container">
            <LivsmedelsLista 
              livsmedel={livsmedelsLista} 
              onSelectLivsmedel={handleSelectLivsmedel} 
              loading={loading}
              selectedLivsmedel={selectedLivsmedel}
            />
            
            <div className="pagination">
              <button onClick={handlePreviousPage} disabled={offset === 0 || loading}>
                Föregående
              </button>
              <span>Sida {Math.floor(offset / limit) + 1}</span>
              <button onClick={handleNextPage} disabled={loading}>
                Nästa
              </button>
            </div>
          </div>
          
          <div className="details-container">
            <LivsmedelsDetails livsmedel={selectedLivsmedel} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
