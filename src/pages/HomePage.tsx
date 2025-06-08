import React from 'react';
import { Typography, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>
        Planetary Migration Feasibility Analysis
      </Typography>
      {user && (
        <Typography variant="body1">
          Welcome, {user.username}! You are logged in as {user.role}.
        </Typography>
      )}
    </Box>
);
};