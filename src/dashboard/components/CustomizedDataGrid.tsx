import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Planet } from "../../types/planet";
import { deletePlanet, getPlanets } from "../../api/planet";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import toast from "react-hot-toast";

export default function CustomizedDataGrid() {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlanets = async (): Promise<void> => {
      const data: Planet[] = await getPlanets();
      setPlanets(data);
    };
    loadPlanets();
  }, []);

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
                  <Typography>
                    Are you sure you want to delete {name}?
                  </Typography>
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
            await deletePlanet(id);
            setPlanets((prev) => prev.filter((p) => p.id !== id));
            toast.success(`${name} deleted successfully.`);
          } catch {
            toast.error("Failed to delete planet.");
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
