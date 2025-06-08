import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { PlanetFactor } from '../../types/planet';

interface FactorFormProps {
  onSubmit: (factor: Omit<PlanetFactor, 'id'>) => void;
  onCancel: () => void;
}

export const FactorForm: React.FC<FactorFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [weight, setWeight] = useState(0.5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, value, weight });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        label="Factor Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        type="number"
        label="Weight"
        value={weight}
        onChange={(e) => setWeight(parseFloat(e.target.value))}
        inputProps={{ step: "0.1", min: "-1", max: "1" }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button onClick={onCancel} sx={{ mr: 2 }}>Cancel</Button>
        <Button type="submit" variant="contained">Save Factor</Button>
      </Box>
    </Box>
  );
};