import axios from 'axios';
import { PlanetFactor } from '../types/planet';

const API_URL = 'http://localhost:5225/api/factors';

export const getFactors = async (): Promise<PlanetFactor[]> => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};