export interface Planet {
    id?: number;
    name: string;
    description: string;
    factors: PlanetFactor[];
  }
  
  export interface PlanetFactor {
    id?: number;
    planetId?: number;
    name: string;
    value: number;
    weight: number;
    unit: string;
  }
  
  export interface EvaluationResult {
    planetScores: PlanetScore[];
    bestPlanetId: number;
    bestPlanetName: string;
    evaluationDate: string;
  }
  
  export interface PlanetScore {
    planetId: number;
    planetName: string;
    score: number;
  }