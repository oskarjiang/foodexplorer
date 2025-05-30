import { Livsmedelsida, Livsmedel, Sprak, Naringsvarde } from '../types';

const API_BASE_URL = 'https://dataportal.livsmedelsverket.se/livsmedel';
const API_VERSION = '1'; // Using the default version from swagger

/**
 * Fetch a list of food items
 */
export const fetchLivsmedel = async (
  offset: number = 0,
  limit: number = 20,
  sprak: Sprak = Sprak.Svenska
): Promise<Livsmedelsida> => {
  const url = `${API_BASE_URL}/api/v${API_VERSION}/livsmedel?offset=${offset}&limit=${limit}&sprak=${sprak}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: Livsmedelsida = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching livsmedel:', error);
    throw error;
  }
};

/**
 * Fetch a single food item by its number
 */
export const fetchLivsmedelsItem = async (
  nummer: number,
  sprak: Sprak = Sprak.Svenska
): Promise<Livsmedel> => {
  const url = `${API_BASE_URL}/api/v${API_VERSION}/livsmedel/${nummer}?sprak=${sprak}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: Livsmedel = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching livsmedel item ${nummer}:`, error);
    throw error;
  }
};

/**
 * Fetch nutritional values for a specific food item
 */
export const fetchNaringsvarden = async (
  nummer: number,
  sprak: Sprak = Sprak.Svenska
): Promise<Naringsvarde[]> => {
  const url = `${API_BASE_URL}/api/v${API_VERSION}/livsmedel/${nummer}/naringsvarden?sprak=${sprak}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: Naringsvarde[] = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching nutritional values for item ${nummer}:`, error);
    throw error;
  }
};
