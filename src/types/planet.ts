export interface Planet {
    id?: number;
    name: string;
    description: string;
    planetType: string;  
    factors: PlanetFactor[];
    planetScore?: number; 
  }
  
  export interface PlanetFactor {
    id?: number;
    planetId?: number;
    name: string;
    value: number;
    unit: string;
    weight: number
  }

  export interface Factor {
    id?: number;
    name: string;
    value: number;
    unit?: string | null;
    weight: number;
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