import React, { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useCategories } from "../../hooks/useCategories/useCategories";
import { useUserRoles } from "../../hooks/useAuth/useUserRoles";
import { useUserProfile } from "../../hooks/useAuth/useUserProfile";
import { Footer } from "../Footer/Footer";
import { Navbar } from "../Navbar/Navbar";

export interface BasePageProps {
  children?: React.ReactNode;
}

export const BasePage: React.FC<BasePageProps> = ({ children }) => {
  const [userContext] = useContext(UserContext);
  const { data: categories } = useCategories();
  const { data: userRoles } = useUserRoles();
  const { data: userProfile } = useUserProfile();

  // Check if user has the 'registered' role
  const isRegisteredUser = userRoles?.some(
    (role) => role.toLowerCase() === "registered"
  );

  return (
    <div>
      {categories && (
        <Navbar
          categories={categories}
          username={userProfile?.username || ""}
        />
      )}
      {children}
      {(!userContext.isAuthenticated || isRegisteredUser) && categories && (
        <Footer categories={categories} />
      )}
    </div>
  );
};
