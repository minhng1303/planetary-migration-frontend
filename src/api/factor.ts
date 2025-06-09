import { Factor, PlanetFactor } from "../types/planet";
import apiClient from "./axios";

export const getFactors = async (): Promise<PlanetFactor[]> => {
  const response = await apiClient.get("/factors");
  return response.data;
};

export const createFactor = async (
  factor: Omit<Factor, "id">
): Promise<Factor> => {
  const response = await apiClient.post("/factors", factor);
  return response.data;
};

export const updateFactor = async (
  id: number,
  factor: Partial<Omit<Factor, "id">>
): Promise<Factor> => {
  const response = await apiClient.put(`/factors/${id}`, factor);
  return response.data;
};

export const deleteFactor = async (id: number): Promise<void> => {
  await apiClient.delete(`/factors/${id}`);
};
