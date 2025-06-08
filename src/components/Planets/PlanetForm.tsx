// src/components/Planets/PlanetForm.tsx
import React from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { Planet } from '../../types/planet';

interface PlanetFormProps {
  planet: Planet;
  onSubmit: (planet: Planet) => void;
  onCancel: () => void;
}

export const PlanetForm: React.FC<PlanetFormProps> = ({ planet, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState<Planet>(planet);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {planet.id ? 'Edit Planet' : 'Create Planet'}
      </Typography>
      
      <TextField
        margin="normal"
        required
        fullWidth
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      
      <TextField
        margin="normal"
        fullWidth
        multiline
        rows={4}
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={onCancel} sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </Box>
    </Box>
  );
};