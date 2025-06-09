export interface Planet {
    id?: number;
    name: string;
    description: string;
    planetScore?: number;   
    factors: PlanetFactor[];
  }
  
  export interface PlanetFactor {
    id?: number;
    planetId?: number;
    name: string;
    value: number;
    unit: string;
    weight: number
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