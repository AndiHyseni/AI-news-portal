import { Button, createStyles } from "@mantine/core";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowBarToRight,
  PlaystationX,
  TextWrapDisabled,
} from "tabler-icons-react";
import "../Administration/Administration.css";

const useSidebarStyles = createStyles({
  closed: {
    width: "0px !important",
    transitionDuration: "600ms",
  },
  open: {
    width: "250px",
    transitionDuration: "300ms",
  },
  transform: {
    transform: "rotate(180deg)",
  },
});

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { classes, cx } = useSidebarStyles();
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "440px",
        backgroundColor: "#212529",
        boxShadow: "0 2px 4px 0 #4d3c8233",
      }}
      className={cx(isOpen ? classes.open : classes.closed)}
    >
      {isOpen && (
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          styles={() => ({
            root: {
              fontSize: 16,
              fontFamily: "Montserrat",
              fontWeight: 600,
              border: "none",

              "&:hover": {
                backgroundColor: "none",
              },
            },
          })}
          className="sidebarButton"
        >
          <PlaystationX size={25} strokeWidth={2} />
        </Button>
      )}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          styles={() => ({
            root: {
              fontSize: 16,
              fontFamily: "Montserrat",
              fontWeight: 600,
              border: "none",
              borderRadius: "0",
              backgroundColor: "#26145c",
              transitionDuration: "600ms",

              "&:hover": {
                backgroundColor: "#26145c",
              },
            },
          })}
          className="sidebarButtonClosed"
        >
          <TextWrapDisabled size={26} strokeWidth={2} color={"white"} />
        </Button>
      )}
      {isOpen && (
        <div className="sidebarContent">
          <ul>
            <NavLink to="/" className="sidebarList">
              <ArrowBarToRight size={25} strokeWidth={2} color={"white"} />
              <h1 className="sidebarItems">Dashboard</h1>
            </NavLink>
            <NavLink to="/Category" className="sidebarList">
              <ArrowBarToRight size={25} strokeWidth={2} color={"white"} />
              <h1 className="sidebarItems">Categories</h1>
            </NavLink>
            <NavLink to="/news" className="sidebarList">
              <ArrowBarToRight size={25} strokeWidth={2} color={"white"} />
              <h1 className="sidebarItems">News</h1>
            </NavLink>
            <NavLink to="/configuration" className="sidebarList">
              <ArrowBarToRight size={25} strokeWidth={2} color={"white"} />
              <h1 className="sidebarItems">Configuration</h1>
            </NavLink>
            <NavLink to="/users" className="sidebarList">
              <ArrowBarToRight size={25} strokeWidth={2} color={"white"} />
              <h1 className="sidebarItems">Users</h1>
            </NavLink>
            <NavLink to="/views" className="sidebarList">
              <ArrowBarToRight size={25} strokeWidth={2} color={"white"} />
              <h1 className="sidebarItems">Views</h1>
            </NavLink>
            <NavLink to="/reaction" className="sidebarList">
              <ArrowBarToRight size={25} strokeWidth={2} color={"white"} />
              <h1 className="sidebarItems">Reactions</h1>
            </NavLink>
          </ul>
        </div>
      )}
    </div>
  );
};
