import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlanet } from '../../api/planet';
import { PlanetForm } from '../../components/Planets/PlanetForm';
import { Planet } from '../../types/planet';
import { Typography } from '@mui/material';

export const PlanetCreate: React.FC = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (planet: Omit<Planet, 'id'>) => {
    try {
      await createPlanet(planet);
      navigate('/planets');
    } catch (err) {
      setError('Failed to create planet');
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Create New Planet</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <PlanetForm
        planet={{ name: '', description: '', factors: [] }}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/planets')}
      />
    </div>
  );
};