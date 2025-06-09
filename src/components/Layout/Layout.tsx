import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import SideMenu from "../../dashboard/components/SideMenu";
import AppNavbar from "../../dashboard/components/AppNavbar";

export const Layout: React.FC = () => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* <SideMenu />
      <AppNavbar /> */}
      <Outlet />
    </Box>
  );
};
