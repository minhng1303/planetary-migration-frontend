// src/components/Planets/PlanetList.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { Planet } from '../../types/planet';
import { useAuth } from '../../contexts/AuthContext';

interface PlanetListProps {
  planets: Planet[];
  onSelect: (planet: Planet) => void;
  onEvaluate: () => void;
  onCreate: () => void;
}

export const PlanetList: React.FC<PlanetListProps> = ({ planets, onSelect, onEvaluate, onCreate }) => {
  const { hasRole } = useAuth();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <Button variant="contained" color="primary" onClick={onEvaluate}>
          Evaluate Planets
        </Button>
        {hasRole('SuperAdmin') || hasRole('PlanetAdmin') ? (
          <Button variant="contained" color="secondary" onClick={onCreate}>
            Add New Planet
          </Button>
        ) : null}
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Factors Count</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {planets.map((planet) => (
              <TableRow key={planet.id}>
                <TableCell>{planet.name}</TableCell>
                <TableCell>{planet.description}</TableCell>
                <TableCell>{planet.factors?.length || 0}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => onSelect(planet)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};