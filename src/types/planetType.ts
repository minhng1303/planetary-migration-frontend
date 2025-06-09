// src/types/planetType.ts
export enum PlanetType {
  TYPE_1 = "TYPE_1",
  TYPE_2 = "TYPE_2",
}

export const PlanetTypeLabels: Record<PlanetType, string> = {
  [PlanetType.TYPE_1]: "Type 1",
  [PlanetType.TYPE_2]: "Type 2",
};