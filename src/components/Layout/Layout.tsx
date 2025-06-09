import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import SideMenu from "../../dashboard/components/SideMenu";
import AppNavbar from "../../dashboard/components/AppNavbar";

export const Layout: React.FC = () => {
  return (
    <Box display="flex" height="100vh">
      <SideMenu />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <AppNavbar />
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
