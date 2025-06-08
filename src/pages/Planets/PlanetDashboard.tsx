import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlanetList } from '../../components/Planets/PlanetList';
import { Planet } from '../../types/planet';
import { useAuth } from '../../contexts/AuthContext';
import { getPlanets } from '../../api/planet';

export const PlanetDashboard: React.FC = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const loadPlanets = async () => {
      try {
        const data = await getPlanets();
        setPlanets(data);
      } catch (err) {
        setError('Failed to load planets');
        if ((err as any).response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    loadPlanets();
  }, [logout]);

  const handleSelectPlanet = (planet: Planet) => {
    navigate(`/planets/${planet.id}`);
  };

  const handleEvaluate = () => {
    navigate('/evaluate');
  };

  const handleCreatePlanet = () => {
    navigate('/planets/new');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Planetary Feasibility Analysis</h1>
      <PlanetList
        planets={planets}
        onSelect={handleSelectPlanet}
        onEvaluate={handleEvaluate}
        onCreate={handleCreatePlanet}
      />
    </div>
  );
};