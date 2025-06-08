import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Paper, Box, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { getPlanet, addFactor } from '../../api/planet';
import { Planet, PlanetFactor } from '../../types/planet';
import { FactorForm } from '../../components/Planets/FactorForm';
import { useAuth } from '../../contexts/AuthContext';
import AddIcon from '@mui/icons-material/Add';

export const PlanetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [planet, setPlanet] = useState<Planet | null>(null);
  const [showFactorForm, setShowFactorForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  useEffect(() => {
    const loadPlanet = async () => {
      try {
        const data = await getPlanet(Number(id));
        setPlanet(data);
      } catch (err) {
        setError('Failed to load planet');
      } finally {
        setLoading(false);
      }
    };

    loadPlanet();
  }, [id]);

  const handleAddFactor = async (factor: Omit<PlanetFactor, 'id'>) => {
    try {
      const newFactor = await addFactor(Number(id), factor);
      setPlanet(prev => prev ? {
        ...prev,
        factors: [...(prev.factors || []), newFactor]
      } : null);
      setShowFactorForm(false);
    } catch (err) {
      setError('Failed to add factor');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!planet) return <div>Planet not found</div>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{planet.name}</Typography>
      <Typography variant="body1" paragraph>{planet.description}</Typography>
      
      <Typography variant="h5" gutterBottom>Factors</Typography>
      {(hasRole('SuperAdmin') || hasRole('PlanetAdmin')) && (
        <IconButton onClick={() => setShowFactorForm(true)}>
          <AddIcon /> Add Factor
        </IconButton>
      )}
      
      {showFactorForm && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <FactorForm 
            onSubmit={handleAddFactor} 
            onCancel={() => setShowFactorForm(false)} 
          />
        </Paper>
      )}

      <List>
        {planet.factors?.map(factor => (
          <ListItem key={factor.id}>
            <ListItemText 
              primary={factor.name} 
              secondary={`Value: ${factor.value}, Weight: ${factor.weight}`} 
            />
          </ListItem>
        ))}
      </List>

      <Button variant="contained" onClick={() => navigate('/planets')}>
        Back to Planets
      </Button>
    </Box>
  );
};