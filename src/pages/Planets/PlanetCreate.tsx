import React, { useEffect, useReducer, useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { createPlanet } from "../../api/planet";
import { PlanetFactor } from "../../types/planet";
import { FactorRow } from "../../components/Planets/FactorRow";
import { getFactors } from "../../api/factor";

interface PlanetCreateProps {
  planet?: {
    name: string;
    description: string;
    factors: PlanetFactor[];
  };
  isAddMode?: boolean;
}

type FactorAction =
  | { type: "update"; index: number; key: keyof PlanetFactor; value: any }
  | { type: "add" }
  | { type: "remove"; index: number }
  | { type: "init"; payload: PlanetFactor[] };

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
    case "init":
      if (!Array.isArray(action.payload)) {
        console.error("Invalid payload for init:", action.payload);
        return state;
      }
      return action.payload;
    default:
      return state;
  }
}

export const PlanetCreate: React.FC<PlanetCreateProps> = ({ planet }) => {
  const [name, setName] = useState<string>(planet?.name || "");
  const [description, setDescription] = useState<string>(planet?.description);
  const [factors, dispatch] = useReducer(factorReducer, []);
  const [defaultFactors, setDefaultFactors] = useState([]);
  const [initialized, setInitialized] = useState(false);

  const [editMode, setEditMode] = useState(!!planet);
  const [addMode, setAddMode] = useState(true);

  useEffect(() => {
    const fetchFactor = async () => {
      try {
        const data = await getFactors();
        setDefaultFactors(data);
      } catch (error) {
        console.error("Error fetching planet:", error);
      }
    };

    fetchFactor(); // ✅ call the function here
  }, []);

  useEffect(() => {
    if (!initialized && defaultFactors.length) {
      const initialFactors = planet?.factors?.length
        ? planet.factors
        : defaultFactors;

      dispatch({ type: "init", payload: initialFactors });
      setInitialized(true);
    }
    if (planet) {
      setAddMode(false);
    }
  }, [planet, defaultFactors, initialized]);

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
        {editMode ? "Edit Planet" : "Add Planet"}
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
              disabled={!editMode && !addMode}
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
              disabled={!editMode && !addMode}
              value={description}
            />
          </Box>

          <Box sx={{ flex: 3 }}>
            {factors.map((factor, index) => (
              <FactorRow
                index={index}
                factor={factor}
                isEditMode={editMode}
                isAddMode={addMode}
                onChange={handleFactorChange}
                onRemove={handleRemoveFactor}
              />
            ))}
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
                disabled={!editMode && !addMode}
                sx={{
                  "&.Mui-disabled": {
                    color: "rgba(0, 0, 0, 0.38)",
                    backgroundColor: "rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                Save
              </Button>
              {editMode && (
                <Button
                  variant="outlined"
                  onClick={() => setEditMode(false)}
                  sx={{ mb: 2 }}
                >
                  Cancel
                </Button>
              )}
              {/* Add an Edit button when not in edit mode */}
              {!editMode && !addMode && (
                <Button
                  variant="outlined"
                  onClick={() => setEditMode(true)}
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
