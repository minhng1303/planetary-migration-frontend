import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Planet } from "../../types/planet";
import { deletePlanet, getPlanets } from "../../api/planet";
import { Box, Button } from "@mui/material";

export default function CustomizedDataGrid() {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const loadPlanets = async (): Promise<void> => {
      try {
        const data: Planet[] = await getPlanets();
        setPlanets(data);
      } catch (err: unknown) {
        setError("Failed to load planets");
        if ((err as any)?.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };
    loadPlanets();
  }, [logout]);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Planet Name", flex: 1, minWidth: 100 },
    {
      field: "description",
      headerName: "Planet Description",
      headerAlign: "left",
      align: "left",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      minWidth: 180,
      renderCell: (params) => {
        const handleView = () => {
          navigate(`/planets/${params.row.id}`);
        };

        const handleDelete = async () => {
          if (
            window.confirm(
              `Are you sure you want to delete ${params.row.name}?`
            )
          ) {
            try {
              await deletePlanet(params.row.id);
              setPlanets((prev) => prev.filter((p) => p.id !== params.row.id));
            } catch (err) {
              alert("Failed to delete planet.");
            }
          }
        };

        return (
          <Box
            display="flex"
            gap={1}
            alignItems="center"
            sx={{ py: 0, height: "100%", justifyContent: "center" }}
          >
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleView}
              sx={{ minHeight: "28px", lineHeight: 1, padding: "8px 8px" }}
            >
              Details
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleDelete}
              sx={{ minHeight: "28px", lineHeight: 1, padding: "2px 8px" }}
            >
              Delete
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <DataGrid
      checkboxSelection
      rows={planets}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="compact"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: "outlined",
              size: "small",
            },
            columnInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            operatorInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: "outlined",
                size: "small",
              },
            },
          },
        },
      }}
    />
  );
}
