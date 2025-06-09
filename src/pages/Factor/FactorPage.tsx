import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Paper,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  getFactors,
  createFactor,
  updateFactor,
  deleteFactor,
} from "../../api/factor";
import { Factor } from "../../types/planet";
import toast from "react-hot-toast";

export const FactorPage: React.FC = () => {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFactor, setEditingFactor] = useState<Factor | null>(null);

  const [formValues, setFormValues] = useState({
    name: "",
    value: 0,
    unit: "",
    weight: 0,
  });

  useEffect(() => {
    loadFactors();
  }, []);

  const loadFactors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFactors();
      setFactors(data);
    } catch {
      setError("Failed to load factors.");
    } finally {
      setLoading(false);
    }
  };

  const openDialogForEdit = (factor: Factor) => {
    setEditingFactor(factor);
    setFormValues({
      name: factor.name,
      value: factor.value,
      unit: factor.unit ?? "",
      weight: factor.weight,
    });
    setDialogOpen(true);
  };

  const openDialogForCreate = () => {
    setEditingFactor(null);
    setFormValues({ name: "", value: 0, unit: "", weight: 0 });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingFactor(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === "name" || name === "unit" ? value : Number(value),
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingFactor) {
        // Update existing factor
        await updateFactor(editingFactor.id, formValues);
      } else {
        // Create new factor
        await createFactor(formValues);
      }
      closeDialog();
      loadFactors();
    } catch {
      toast.error("Failed to save factor.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      toast(
        (t) => (
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography>Are you sure you want to delete?</Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
              >
                Yes
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
              >
                No
              </Button>
            </Box>
          </Box>
        ),
        { duration: Infinity }
      );
    });

    if (!confirmed) return;

    try {
      await deleteFactor(id);
      setFactors((prev) => prev.filter((f) => f.id !== id));
    } catch {
      toast.error("Failed to delete factor.");
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "unit", headerName: "Unit", width: 100 },
    { field: "weight", headerName: "Weight", width: 100, type: "number" },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            color="primary"
            onClick={() => openDialogForEdit(params.row as Factor)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id as number)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ m: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Factors
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={openDialogForCreate}
        sx={{ mb: 2 }}
      >
        Add New Factor
      </Button>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Paper style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={factors}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        />
      </Paper>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingFactor ? "Edit Factor" : "Add Factor"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Unit"
            name="unit"
            value={formValues.unit}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Weight"
            name="weight"
            type="number"
            value={formValues.weight}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} color="primary">
            {editingFactor ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
