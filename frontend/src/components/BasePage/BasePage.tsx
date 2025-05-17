import React, { useContext, useMemo } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useCategories } from "../../hooks/useCategories/useCategories";
import { useUserProfile } from "../../hooks/useAuth/useUserProfile";
import { Footer } from "../Footer/Footer";
import { Navbar } from "../Navbar/Navbar";
import "./BasePage.css";
import { Categories } from "../../types/categories/categories";

export interface BasePageProps {
  children?: React.ReactNode;
}

export const BasePage: React.FC<BasePageProps> = ({ children }) => {
  const [userContext] = useContext(UserContext);
  const { data: categoriesData } = useCategories();

  // Extract only the categories array from the API response
  const categories = useMemo(() => {
    if (!categoriesData) return null;

    // Handle both array and object response formats
    if (Array.isArray(categoriesData)) {
      return categoriesData as Categories[];
    }

    // If it's an object with a categories property, use that
    if (
      categoriesData &&
      typeof categoriesData === "object" &&
      "categories" in categoriesData
    ) {
      return (categoriesData as { categories: Categories[] }).categories;
    }

    return null;
  }, [categoriesData]);

  const { data: userProfile } = useUserProfile();

  // Check if user is an admin (don't show footer for admins)
  const isAdmin = userContext.roles?.includes("admin");

  return (
    <div className="base-page-container">
      <div className="base-page-header">
        {categories && (
          <Navbar
            categories={categories}
            username={userProfile?.username || ""}
          />
        )}
      </div>

      <div className="base-page-content">{children}</div>

      <div className="base-page-footer">
        {(!userContext.isAuthenticated || !isAdmin) && categories && (
          <Footer categories={categories} />
        )}
      </div>
    </div>
  );
};
