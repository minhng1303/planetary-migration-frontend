import React, { useReducer, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  TextField,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { createPlanet } from "../../api/planet";
import { PlanetFactor } from "../../types/planet";
import { FactorRow } from "../../components/Planets/FactorRow";

interface PlanetCreateProps {
  planet?: {
    name: string;
    description: string;
    factors: PlanetFactor[];
  };
}

type FactorAction =
  | { type: "update"; index: number; key: keyof PlanetFactor; value: any }
  | { type: "add" }
  | { type: "remove"; index: number };

function factorReducer(
  state: PlanetFactor[],
  action: FactorAction
): PlanetFactor[] {
  switch (action.type) {
    case "update":
      return state.map((factor, idx) =>
        idx === action.index
          ? { ...factor, [action.key]: action.value }
          : factor
      );
    case "add":
      return [...state, { name: "", value: 0, unit: "", weight: 1 }];
    case "remove":
      return state.filter((_, idx) => idx !== action.index);
    default:
      return state;
  }
}

export const PlanetCreate: React.FC<PlanetCreateProps> = ({ planet }) => {
  const [name, setName] = useState<string>(planet?.name || "");
  const [description, setDescription] = useState<string>(planet?.description);
  const [factors, dispatch] = useReducer(
    factorReducer,
    planet?.factors?.length
      ? planet.factors
      : [{ name: "", value: 0, unit: "", weight: 1 }]
  );

  const [isEditMode, setIsEditMode] = useState(!!planet);

  const navigate = useNavigate();

  const handleFactorChange = <K extends keyof PlanetFactor>(
    index: number,
    key: K,
    value: PlanetFactor[K]
  ) => {
    dispatch({ type: "update", index, key, value });
  };

  const handleAddFactor = () => dispatch({ type: "add" });

  const handleRemoveFactor = (index: number) =>
    dispatch({ type: "remove", index });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPlanet({ name, description, factors });
      navigate("/planets");
    } catch (err) {
      console.error("Error creating planet", err);
      alert("Failed to create planet.");
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? "Edit Planet" : "View Planet"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          <Box sx={{ flex: 2 }}>
            <TextField
              label="Planet Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              variant="standard"
              required
              placeholder="Enter Name"
              disabled={!isEditMode} // disabled if not editing
            />
            <TextField
              id="filled-multiline-static"
              label="Description"
              multiline
              minRows={4}
              maxRows={10}
              variant="standard"
              fullWidth
              placeholder="Enter description"
              margin="normal"
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={!isEditMode}
              value={description}
            />
          </Box>

          <Box sx={{ flex: 3 }}>
            {factors.map((factor, index) => (
              <FactorRow
                key={index}
                index={index}
                factor={factor}
                isEditMode={isEditMode}
                onChange={handleFactorChange}
                onRemove={handleRemoveFactor}
              />
            ))}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Button
                startIcon={<Add />}
                onClick={handleAddFactor}
                disabled={!isEditMode}
              >
                Add Factor
              </Button>
            </Box>
          </Box>

          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isEditMode}
                sx={{
                  "&.Mui-disabled": {
                    color: "rgba(0, 0, 0, 0.38)",
                    backgroundColor: "rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                Save
              </Button>
              {isEditMode && (
                <Button
                  variant="outlined"
                  onClick={() => setIsEditMode(false)}
                  sx={{ mb: 2 }}
                >
                  Cancel
                </Button>
              )}
              {/* Add an Edit button when not in edit mode */}
              {!isEditMode && (
                <Button
                  variant="outlined"
                  onClick={() => setIsEditMode(true)}
                  sx={{ mb: 2 }}
                >
                  Edit
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </form>
    </Box>
  );
};
