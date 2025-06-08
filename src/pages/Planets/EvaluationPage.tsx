import React, { useState, useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { evaluatePlanets } from '../../api/planet';
import { EvaluationResult } from '../../types/planet';
import { EvaluationResult as EvaluationResultComponent } from '../../components/Planets/EvaluationResult';

export const EvaluationPage: React.FC = () => {
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEvaluate = async () => {
    setLoading(true);
    try {
      const evaluationResult = await evaluatePlanets();
      setResult(evaluationResult);
    } catch (err) {
      setError('Failed to evaluate planets');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Planet Evaluation</Typography>
      
      <Button 
        variant="contained" 
        onClick={handleEvaluate}
        disabled={loading}
        sx={{ mb: 3 }}
      >
        {loading ? 'Evaluating...' : 'Run Evaluation'}
      </Button>

      {error && <Typography color="error">{error}</Typography>}
      {result && <EvaluationResultComponent result={result} />}

      <Button 
        variant="outlined" 
        onClick={() => navigate('/planets')}
        sx={{ mt: 3 }}
      >
        Back to Planets
      </Button>
    </Box>
  );
};