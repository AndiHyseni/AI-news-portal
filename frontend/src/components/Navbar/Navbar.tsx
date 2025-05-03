import { Image, Menu } from "@mantine/core";
import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ChevronDown, Logout, User, UserPlus } from "tabler-icons-react";
import { UserContext } from "../../contexts/UserContext";
import { useConfiguration } from "../../hooks/useConfiguration/useConfiguration";
import { Categories } from "../../types/categories/categories";
import "../Navbar/Navbar.css";

type CategoriesResponse = Categories[] | { categories: Categories[] };

export interface CategoriesProps {
  categories: CategoriesResponse;
  username?: string;
}

export const Navbar: React.FC<CategoriesProps> = ({
  categories = [],
  username = "",
}) => {
  const [userContext] = useContext(UserContext);
  const navigate = useNavigate();
  const { data } = useConfiguration();

  // Use the username from context if available
  const displayName = userContext.username || username;

  const logout = () => {
    localStorage.removeItem("jwt");
    navigate("/");
    window.location.reload();
  };

  // Ensure categories is an array and handle the data structure
  const categoriesArray: Categories[] = Array.isArray(categories)
    ? categories
    : (categories as { categories: Categories[] }).categories || [];

  return (
    <div className="navbar">
      <Link to="/">
        <Image src={data?.header_logo} height={50} width={50} />
      </Link>
      {/* Show categories for everyone */}
      <div style={{ display: "flex" }}>
        {categoriesArray
          .filter((x: Categories) => x.show_online === true)
          .map((category: Categories, index: number) => (
            <NavLink key={index} to={`/category/${category.id}`}>
              <div className="navbarItem">{category.name}</div>
            </NavLink>
          ))}
      </div>

      {userContext.isAuthenticated && (
        <div className="loginNavbar">
          <Menu>
            <Menu.Target>
              <h1 className="username">
                {displayName}
                <ChevronDown
                  className="usernameArrow"
                  size={20}
                  strokeWidth={2}
                  color={"white"}
                />
              </h1>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => navigate(`/saved`)}>
                <h1 className="menuItem">Saved News</h1>
              </Menu.Item>
              {userContext.roles?.includes("admin") && (
                <Menu.Item onClick={() => navigate("/news")}>
                  <h1 className="menuItem">Admin Dashboard</h1>
                </Menu.Item>
              )}
              <Menu.Item onClick={logout}>
                {" "}
                <Logout
                  className="logoutbutton"
                  size={20}
                  strokeWidth={2}
                  color={"black"}
                />
                <h1 className="menuItem">Logout</h1>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      )}
      {!userContext.isAuthenticated && (
        <div className="loginNavbar">
          <Link to="/login">
            <User size={20} strokeWidth={2} color={"white"} />
          </Link>
          <Link
            to="/login"
            className="logintext"
            style={{ paddingRight: "10px" }}
          >
            <b>Login</b>
          </Link>
          <hr style={{ height: "20px", width: "0px" }} />
          <Link to="/register">
            <UserPlus
              size={20}
              strokeWidth={2}
              color={"white"}
              style={{ paddingLeft: "10px" }}
            />
          </Link>
          <Link to="/register" className="logintext">
            <b>Register</b>
          </Link>
        </div>
      )}
    </div>
  );
};
