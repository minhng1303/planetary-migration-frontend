import React from "react";
import { TextField, IconButton, Paper, Box } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { PlanetFactor } from "../../types/planet";

interface FactorRowProps {
  index: number;
  factor: PlanetFactor;
  isEditMode: boolean;
  onChange: (index: number, key: keyof PlanetFactor, value: any) => void;
  onRemove: (index: number) => void;
}

export const FactorRow: React.FC<FactorRowProps> = React.memo(
  ({ index, factor, isEditMode, onChange, onRemove }) => {
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
            disabled={!isEditMode}
          />
          <TextField
            label="Value"
            type="number"
            value={factor.value}
            onChange={(e) => onChange(index, "value", +e.target.value)}
            required
            sx={{ flex: "1 1 20%" }}
            disabled={!isEditMode}
          />
          <TextField
            label="Unit"
            value={factor.unit}
            onChange={(e) => onChange(index, "unit", e.target.value)}
            sx={{ flex: "1 1 20%" }}
            disabled={!isEditMode}
            required
          />
          <TextField
            label="Weight"
            type="number"
            value={factor.weight}
            onChange={(e) => onChange(index, "weight", +e.target.value)}
            required
            sx={{ flex: "1 1 20%" }}
            disabled={!isEditMode}
          />
          <IconButton
            color="error"
            onClick={() => onRemove(index)}
            sx={{ alignSelf: "center" }}
            disabled={!isEditMode}
          >
            <Delete />
          </IconButton>
        </Box>
      </Paper>
    );
  },
  (prevProps, nextProps) =>
    prevProps.factor === nextProps.factor &&
    prevProps.isEditMode === nextProps.isEditMode
);
