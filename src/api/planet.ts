// src/api/planets.ts
import axios from 'axios';
import { Planet, PlanetFactor, EvaluationResult } from '../types/planet';

const API_URL = 'http://localhost:5225/api/Planets';

export const getPlanets = async (): Promise<Planet[]> => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const getPlanet = async (id: number): Promise<Planet> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const createPlanet = async (planet: Omit<Planet, 'id'>): Promise<Planet> => {
  const response = await axios.post(API_URL, planet, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const updatePlanet = async (planet: Planet): Promise<void> => {
  await axios.put(`${API_URL}/${planet.id}`, planet, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

export const deletePlanet = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

export const addFactor = async (planetId: number, factor: Omit<PlanetFactor, 'id'>): Promise<PlanetFactor> => {
  const response = await axios.post(`${API_URL}/${planetId}/factors`, factor, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const evaluatePlanets = async (): Promise<EvaluationResult> => {
  const response = await axios.get(`${API_URL}/evaluate`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};