import React, { useContext, useMemo, ReactNode } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useCategories } from "../../hooks/useCategories/useCategories";
import { useUserProfile } from "../../hooks/useAuth/useUserProfile";
import { Footer } from "../Footer/Footer";
import { Navbar } from "../Navbar/Navbar";
import { Chatbot } from "../Chatbot/Chatbot";
import "./BasePage.css";
import { Categories } from "../../types/categories/categories";
import { useConfiguration } from "../../hooks/useConfiguration/useConfiguration";
import { useScrollToTop } from "../../hooks/useScrollToTop/useScrollToTop";

interface BasePageProps {
  children: ReactNode;
}

export const BasePage: React.FC<BasePageProps> = ({ children }) => {
  const [userContext] = useContext(UserContext);
  const { data: categoriesData } = useCategories();
  const { data } = useConfiguration();

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

  useScrollToTop();

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

      {/* Chatbot component */}
      {data?.show_chatbot == true && <Chatbot />}
    </div>
  );
};
