import React from "react";
import { TextField, IconButton, Paper, Box } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { PlanetFactor } from "../../types/planet";

interface FactorRowProps {
  index: number;
  factor: PlanetFactor;
  isEditMode: boolean;
  isAddMode: boolean;
  onChange: (index: number, key: keyof PlanetFactor, value: any) => void;
}

export const FactorRow: React.FC<FactorRowProps> = React.memo(
  ({ index, factor, isEditMode, isAddMode, onChange }) => {
    return (
      <Paper sx={{ p: 2, mb: 2 }} variant="outlined">
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            alignItems: "flex-end",
          }}
        >
          <TextField
            label="Name"
            value={factor.name}
            onChange={(e) => onChange(index, "name", e.target.value)}
            required
            sx={{ flex: "1 1 20%" }}
            disabled={!isEditMode && !isAddMode}
          />
          <TextField
            label="Value"
            type="number"
            value={factor.value}
            onChange={(e) => onChange(index, "value", +e.target.value)}
            required
            inputProps={{
              min: 0,
              max: 100,
            }}
            sx={{ flex: "1 1 20%" }}
            disabled={!isEditMode && !isAddMode}
          />
          <TextField
            label="Unit"
            value={factor.unit}
            onChange={(e) => onChange(index, "unit", e.target.value)}
            sx={{ flex: "1 1 20%" }}
            disabled={!isEditMode && !isAddMode}
            required
          />
          <TextField
            label="Weight"
            type="number"
            value={factor.weight}
            onChange={(e) => onChange(index, "weight", +e.target.value)}
            required
            sx={{ flex: "1 1 20%" }}
            disabled={!isEditMode && !isAddMode}
          />
        </Box>
      </Paper>
    );
  },
  (prevProps, nextProps) =>
    prevProps.factor === nextProps.factor &&
    prevProps.isEditMode === nextProps.isEditMode
);
