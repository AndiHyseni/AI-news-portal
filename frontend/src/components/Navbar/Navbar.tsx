import { Image, Menu } from "@mantine/core";
import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ChevronDown, Logout, User, UserPlus } from "tabler-icons-react";
import { UserContext } from "../../contexts/UserContext";
import { useConfiguration } from "../../hooks/useConfiguration/useConfiguration";
import { Categories } from "../../types/categories/categories";
import "../Navbar/Navbar.css";

export interface CategoriesProps {
  categories: Categories[] | Categories;
  username?: string;
}

export const Navbar: React.FC<CategoriesProps> = ({
  categories = [],
  username = "",
}) => {
  const [userContext] = useContext(UserContext);
  const navigate = useNavigate();
  const { data } = useConfiguration();

  // Ensure categories is always an array
  const categoriesArray = Array.isArray(categories) ? categories : [categories];

  // Use the username from context if available
  const displayName = userContext.username || username;

  // Check if user is admin
  const isAdmin = userContext.roles?.includes("admin");

  const logout = () => {
    localStorage.removeItem("jwt");
    navigate("/");
    window.location.reload();
  };

  const handleLogoClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <Link to="/" onClick={handleLogoClick}>
          <Image src={data?.header_logo} height={45} width={45} radius="md" />
        </Link>
      </div>

      <div className="navbar-links">
        {categoriesArray
          .filter((category: Categories) => Boolean(category.show_online))
          .map((category: Categories, index: number) => (
            <NavLink
              key={index}
              to={`/category/${category.id}`}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <div className="navbarItem">{category.name}</div>
            </NavLink>
          ))}
      </div>

      {userContext.isAuthenticated ? (
        <div className="loginNavbar">
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <h1 className="username">
                {displayName}
                <ChevronDown
                  className="usernameArrow"
                  size={16}
                  strokeWidth={2}
                  color={"white"}
                />
              </h1>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                icon={<User size={16} />}
                onClick={() => navigate(`/saved`)}
              >
                <h1 className="menuItem">Saved News</h1>
              </Menu.Item>

              {isAdmin && (
                <Menu.Item
                  icon={<User size={16} />}
                  onClick={() => navigate("/admin")}
                >
                  <h1 className="menuItem">Admin Dashboard</h1>
                </Menu.Item>
              )}

              <Menu.Divider />

              <Menu.Item
                icon={<Logout size={16} />}
                color="red"
                onClick={logout}
              >
                <h1 className="menuItem">Logout</h1>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      ) : (
        <div className="loginNavbar">
          <div className="login-button-group">
            <Link to="/login" className="logintext">
              <User size={16} strokeWidth={2} />
              <span>Login</span>
            </Link>

            <div className="login-divider"></div>

            <Link to="/register" className="logintext">
              <UserPlus size={16} strokeWidth={2} />
              <span>Register</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
