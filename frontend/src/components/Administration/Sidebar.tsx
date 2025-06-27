import { Button, createStyles, Text, Box, ActionIcon } from "@mantine/core";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  PlaystationX,
  Menu2,
  Dashboard,
  Category,
  News,
  Settings,
  Users,
  Eye,
  MoodSmile,
} from "tabler-icons-react";
import "../Administration/Administration.css";

const useSidebarStyles = createStyles({
  sidebar: {
    position: "fixed",
    height: "100vh",
    backgroundColor: "#212529",
    boxShadow: "0 2px 20px rgba(0, 0, 0, 0.15)",
    borderRadius: "0 16px 16px 0",
    transition: "width 0.3s ease",
    overflow: "hidden",
    zIndex: 100,
  },
  open: {
    width: "280px",
  },
  closed: {
    width: "60px",
  },
  toggleButtonOpen: {
    position: "absolute",
    top: "15px",
    right: "15px",
    zIndex: 100,
  },
  toggleButtonClosed: {
    position: "absolute",
    top: "15px",
    left: "15px",
    zIndex: 100,
  },
  content: {
    width: "280px",
    paddingTop: "60px",
    height: "100%",
    overflowY: "auto",
  },
});

interface SidebarProps {
  onToggle?: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { classes } = useSidebarStyles();

  const menuItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: <Dashboard size={22} strokeWidth={1.5} />,
      exact: true,
    },
    {
      path: "/admin/categories",
      label: "Categories",
      icon: <Category size={22} strokeWidth={1.5} />,
    },
    {
      path: "/admin/news",
      label: "News",
      icon: <News size={22} strokeWidth={1.5} />,
    },
    {
      path: "/admin/configuration",
      label: "Configuration",
      icon: <Settings size={22} strokeWidth={1.5} />,
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: <Users size={22} strokeWidth={1.5} />,
    },
    {
      path: "/admin/views",
      label: "Views",
      icon: <Eye size={22} strokeWidth={1.5} />,
    },
    {
      path: "/admin/reactions",
      label: "Reactions",
      icon: <MoodSmile size={22} strokeWidth={1.5} />,
    },
  ];

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  return (
    <Box
      className={`${classes.sidebar} ${isOpen ? classes.open : classes.closed}`}
      style={{ height: "auto", minHeight: "100vh" }}
    >
      {/* Toggle button */}
      <ActionIcon
        onClick={toggleSidebar}
        variant="filled"
        size="lg"
        className={
          isOpen ? classes.toggleButtonOpen : classes.toggleButtonClosed
        }
        sx={{
          backgroundColor: "#26145c",
          "&:hover": {
            backgroundColor: "#371e83",
          },
        }}
      >
        {isOpen ? <PlaystationX size={18} /> : <Menu2 size={18} />}
      </ActionIcon>

      {/* Sidebar content */}
      <div className={classes.content}>
        {isOpen && (
          <Text
            component="h1"
            sx={{
              fontSize: "26px",
              fontWeight: 700,
              color: "white",
              textAlign: "center",
              padding: "30px 0 40px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              marginBottom: "20px",
            }}
          >
            Admin Panel
          </Text>
        )}

        <ul className={isOpen ? "nav-menu" : "nav-menu-collapsed"}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `sidebarList ${isActive ? "active" : ""}`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive
                  ? "rgba(38, 20, 92, 0.8)"
                  : "transparent",
                borderRadius: "8px",
                margin: "8px 0",
                padding: "10px 15px",
                justifyContent: isOpen ? "flex-start" : "center",
              })}
            >
              {item.icon}
              {isOpen && <h1 className="sidebarItems">{item.label}</h1>}
            </NavLink>
          ))}
        </ul>
      </div>
    </Box>
  );
};
