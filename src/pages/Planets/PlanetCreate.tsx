import React, { useEffect, useReducer, useState } from "react";
import { Box, Button, Typography, TextField, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createPlanet } from "../../api/planet";
import { PlanetFactor } from "../../types/planet";
import { FactorRow } from "../../components/Planets/FactorRow";
import { getFactors } from "../../api/factor";
import { PlanetType, PlanetTypeLabels } from "../../types/planetType";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext"; // ✅ Import AuthContext

interface PlanetCreateProps {
  planet?: {
    id?: number; // Needed for access checks
    name: string;
    description: string;
    planetType: string;
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
      return Array.isArray(action.payload) ? action.payload : state;
    default:
      return state;
  }
}

export const PlanetCreate: React.FC<PlanetCreateProps> = ({ planet }) => {
  const { hasAccessToPlanet, loading: authLoading } = useAuth(); // ✅ use context
  const navigate = useNavigate();

  const [name, setName] = useState<string>(planet?.name || "");
  const [description, setDescription] = useState<string>(
    planet?.description || ""
  );
  const [planetType, setPlanetType] = useState<string>(
    planet?.planetType || ""
  );

  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const [factors, dispatch] = useReducer(factorReducer, []);
  const [defaultFactors, setDefaultFactors] = useState<PlanetFactor[]>([]);
  const [initialized, setInitialized] = useState(false);

  const isAddMode = !planet;
  const [editMode, setEditMode] = useState(isAddMode);

  const [hasAccess, setHasAccess] = useState(false);
  const [factorErrors, setFactorErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!planet) {
      setHasAccess(true); // Anyone allowed to add (optional, could also restrict)
    } else {
      setHasAccess(hasAccessToPlanet(planet.id!, planet.planetType));
    }
  }, [planet, hasAccessToPlanet]);

  useEffect(() => {
    const fetchFactors = async () => {
      try {
        const data = await getFactors();
        setDefaultFactors(data);
      } catch (error) {
        toast.error("Error fetching factors:", error);
      }
    };
    fetchFactors();
  }, []);

  useEffect(() => {
    if (!initialized && defaultFactors.length) {
      const initialFactors = planet?.factors?.length
        ? planet.factors
        : defaultFactors;
      dispatch({ type: "init", payload: initialFactors });
      setInitialized(true);
    }
  }, [planet, defaultFactors, initialized]);

  const handleFactorChange = <K extends keyof PlanetFactor>(
    index: number,
    key: K,
    value: PlanetFactor[K]
  ) => {
    dispatch({ type: "update", index, key, value });
  };

  const validate = (): boolean => {
    let valid = true;

    setNameError("");
    setDescriptionError("");
    setFactorErrors([]);

    if (!name.trim()) {
      setNameError("Planet name is required.");
      valid = false;
    }

    if (!description.trim()) {
      setDescriptionError("Description is required.");
      valid = false;
    }

    const newFactorErrors = factors.map((factor) => {
      if (factor.value < 0 || factor.value > 100) {
        valid = false;
        return "Value must be between 0 and 100.";
      }
      return "";
    });

    setFactorErrors(newFactorErrors);

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await createPlanet({ name, description, factors, planetType });
      toast.success("Planet saved successfully!");
      navigate("/planets");
    } catch (err) {
      toast.error(
        isAddMode ? "Failed to create planet." : "Failed to update planet."
      );
    }
  };
  if (authLoading) return <Typography>Loading...</Typography>;

  const isFormDisabled = !hasAccess || (!editMode && !isAddMode);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {isAddMode ? "Add Planet" : editMode ? "Edit Planet" : "Planet Details"}
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
              disabled={isFormDisabled}
              error={!!nameError}
              helperText={nameError}
            />
            <TextField
              label="Description"
              multiline
              minRows={4}
              maxRows={10}
              variant="standard"
              fullWidth
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isFormDisabled}
              value={description}
              margin="normal"
              error={!!descriptionError}
              helperText={descriptionError}
            />
            <TextField
              select
              label="Planet Type"
              value={planetType}
              onChange={(e) => setPlanetType(e.target.value)}
              variant="standard"
              fullWidth
              margin="normal"
              disabled={isFormDisabled}
              required
            >
              {Object.values(PlanetType).map((type) => (
                <MenuItem key={type} value={type}>
                  {PlanetTypeLabels[type]}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ flex: 3 }}>
            {factors.map((factor, index) => (
              <FactorRow
                key={index}
                index={index}
                factor={factor}
                isEditMode={editMode}
                isAddMode={isAddMode}
                onChange={handleFactorChange}
                error={factorErrors[index]}
              />
            ))}
          </Box>

          <Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {!isFormDisabled && (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isFormDisabled}
                >
                  Save
                </Button>
              )}
              {!isFormDisabled && (
                <Button variant="outlined" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              )}
              {isFormDisabled && (
                <Button variant="outlined" onClick={() => setEditMode(true)}>
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
