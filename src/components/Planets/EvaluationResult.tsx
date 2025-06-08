// src/components/Planets/EvaluationResult.tsx
import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { EvaluationResult as EvaluationResultType } from '../../types/planet';

interface EvaluationResultProps {
  result: EvaluationResultType;
}

export const EvaluationResult: React.FC<EvaluationResultProps> = ({ result }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Evaluation Results
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Evaluated on: {new Date(result.evaluationDate).toLocaleString()}
        </Typography>
        
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Best Planet: {result.bestPlanetName}
          </Typography>
        </Box>
        
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Detailed Scores:
          </Typography>
          {result.planetScores.map((score) => (
            <Box key={score.planetId} mb={2}>
              <Typography>{score.planetName}</Typography>
              <LinearProgress 
                variant="determinate" 
                value={score.score * 100} 
                sx={{ height: 20, borderRadius: 1 }}
              />
              <Typography align="right">
                {Math.round(score.score * 100)}%
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};