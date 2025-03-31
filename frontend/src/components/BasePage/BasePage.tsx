import jwtDecode from "jwt-decode";
import React, { useContext } from "react";
import { UserContext } from "../../contexes/UserContext";
import { useCategories } from "../../hooks/useCategories/useCategories";
import { Role } from "../../types/auth/login";
import { Footer } from "../Footer/Footer";
import { Navbar } from "../Navbar/Navbar";

export interface BasePageProps {
  children?: React.ReactNode;
}

export const BasePage: React.FC<BasePageProps> = ({ children }) => {
  const [userContext] = useContext(UserContext);
  const { data } = useCategories();

  const token: any =
    localStorage.getItem("jwt") != null
      ? jwtDecode(localStorage.getItem("jwt")!)
      : "";

  var role: string =
    token != null
      ? token["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      : "";

  return (
    <div>
      {data && <Navbar categories={data} />}
      {children}
      {(token == "" || role == "Registered") && data && (
        <Footer categories={data} />
      )}
    </div>
  );
};
