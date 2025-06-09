import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, CircularProgress } from "@mui/material";
import { Planet } from "../../types/planet";
import { getPlanet } from "../../api/planet";
import { PlanetCreate } from "./PlanetCreate";

export const PlanetDetailPage: React.FC = () => {
  const { id } = useParams();
  const [planet, setPlanet] = useState<Planet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanet = async () => {
      try {
        const data = await getPlanet(Number(id));
        setPlanet(data);
      } catch (error) {
        console.error("Error fetching planet:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanet();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!planet) return <Typography>No planet data found</Typography>;

  return <PlanetCreate planet={planet} />;
};
