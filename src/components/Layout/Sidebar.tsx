import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        <ListItem onClick={() => navigate('/')}>
          <ListItemText primary="Home" />
        </ListItem>
        {user && (
          <>
            <ListItem onClick={() => navigate('/planets')}>
              <ListItemText primary="Planets" />
            </ListItem>
            <ListItem onClick={() => navigate('/evaluate')}>
              <ListItemText primary="Evaluate" />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
};