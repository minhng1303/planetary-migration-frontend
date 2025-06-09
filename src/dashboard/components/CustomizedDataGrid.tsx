import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Planet } from "../../types/planet";
import { deletePlanet, getPlanets } from "../../api/planet";
import { Box, IconButton, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function CustomizedDataGrid() {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const loadPlanets = async (): Promise<void> => {
      try {
        const data: Planet[] = await getPlanets();
        setPlanets(data);
      } catch (err: unknown) {
        if ((err as any)?.response?.status === 401) {
          logout();
        }
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
      minWidth: 100,
      renderCell: (params) => {
        const { id, name } = params.row;

        const handleView = () => {
          navigate(`/planets/${id}`);
        };

        const handleDelete = async () => {
          if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            try {
              await deletePlanet(id);
              setPlanets((prev) => prev.filter((p) => p.id !== id));
            } catch {
              alert("Failed to delete planet.");
            }
          }
        };

        return (
          <Box
            display="flex"
            gap={1}
            alignItems="center"
            justifyContent="center"
            sx={{ height: "100%", py: 0 }}
          >
            <Tooltip title="View Details">
              <IconButton size="small" color="primary" onClick={handleView}>
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Planet">
              <IconButton size="small" color="error" onClick={handleDelete}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <DataGrid
      rows={planets}
      columns={columns}
      rowHeight={70}
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
