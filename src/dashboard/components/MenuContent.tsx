import { useNavigate, useLocation } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { useAuth } from "../../contexts/AuthContext";

export default function MenuContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = useAuth();

  const secondaryListItems = [
    { text: "Settings", icon: <SettingsRoundedIcon />, path: "/settings" },
    { text: "About", icon: <InfoRoundedIcon />, path: "/about" },
    { text: "Feedback", icon: <HelpRoundedIcon />, path: "/feedback" },
  ];

  const mainListItems = [
    { text: "Home", icon: <HomeRoundedIcon />, path: "/planets" },
  ];

  if (hasRole("PlanetAdmin") || hasRole("SuperAdmin")) {
    mainListItems.push({
      text: "Analytics",
      icon: <AnalyticsRoundedIcon />,
      path: "/analytics",
    });
  }

  if (hasRole("SuperAdmin")) {
    mainListItems.push({
      text: "Factors",
      icon: <TuneRoundedIcon />,
      path: "/factors",
    });
    mainListItems.push({
      text: "Add Planet",
      icon: <AddRoundedIcon />,
      path: "/planets/new",
    });
  }

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
