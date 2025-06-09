import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getPlanetsWithStatistic } from "../../api/planet";
import { Planet } from "../../types/planet";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, LinearProgress, Typography } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const DARK_COLORS = [
  "#003f5c",
  "#2f4b7c",
  "#665191",
  "#a05195",
  "#d45087",
  "#f95d6a",
  "#ff7c43",
  "#ffa600",
];

export const EvaluationPage: React.FC = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlanets = async (): Promise<void> => {
      try {
        const data: Planet[] = await getPlanetsWithStatistic();
        setPlanets(data);
      } catch {
        setError("Failed to load planets");
      } finally {
        setLoading(false);
      }
    };
    loadPlanets();
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;
  if (planets.length === 0)
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          mx: "auto",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "text.secondary",
          p: 3,
          textAlign: "center",
        }}
      >
        <SentimentDissatisfiedIcon sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No planet data found
        </Typography>
        <Typography variant="body1" color="textSecondary">
          There are currently no planets with evaluation data available. Please
          check back later or add new planet data.
        </Typography>
      </Box>
    );

  // Get all unique factor names
  const allFactorNames = Array.from(
    new Set(planets.flatMap((p) => p.factors.map((f) => f.name)))
  );

  // For each factor, build chart data: [{ name: planetName, value: ... }, ...]
  const dataByFactor = allFactorNames.map((factorName) => ({
    factorName,
    data: planets.map((planet) => ({
      name: planet.name,
      value: planet.factors.find((f) => f.name === factorName)?.value ?? 0,
    })),
  }));

  const columns: GridColDef[] = [
    { field: "name", headerName: "Planet Name", flex: 1, minWidth: 150 },
    {
      field: "description",
      headerName: "Planet Description",
      flex: 2,
      minWidth: 200,
    },
    {
      field: "planetScore",
      headerName: "Evaluation Score",
      flex: 1,
      minWidth: 180,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<any>) => {
        const value = params.value ?? 0;
        return (
          <Box width="100%" display="flex" alignItems="center">
            <Box flexGrow={1} mr={1}>
              <LinearProgress
                variant="determinate"
                value={value}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="body2" color="textSecondary">
              {value}%
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <div>
      <Box sx={{ m: 2 }}>
        <Typography variant="h5" gutterBottom>
          Top 3 planets with the highest feasibility rate
        </Typography>
        <DataGrid
          rows={planets}
          columns={columns}
          loading={loading}
          density="compact"
          pageSizeOptions={[5]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
        />
      </Box>
      <Box
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "40px",
          padding: "20px",
        }}
      >
        {dataByFactor.map(({ factorName, data }) => (
          <div key={factorName} style={{ width: 350, textAlign: "center" }}>
            <h3>{factorName}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={data}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" name={""}>
                  {data.map((_, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={DARK_COLORS[idx % DARK_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </Box>
    </div>
  );
};
