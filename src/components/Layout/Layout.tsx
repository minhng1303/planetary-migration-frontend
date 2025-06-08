import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Box } from '@mui/material';

export const Layout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: '240px', // Matches sidebar width
          marginTop: '64px',   // Matches navbar height
        }}
      >
        <Outlet /> {/* This renders the current page inside the layout */}
      </Box>
    </Box>
  );
};
