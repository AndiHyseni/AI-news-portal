import { Container } from "@mantine/core";
import { useRegister } from "../../hooks/useAuth/useRegister";
import { useCategories } from "../../hooks/useCategories/useCategories";
import { Register } from "../../pages/Register/Register";
import { Footer } from "../Footer/Footer";
import { Navbar } from "../Navbar/Navbar";
import { useMemo } from "react";
import { Categories } from "../../types/categories/categories";

export const RegisterPage: React.FC = () => {
  const createRegisterMutation = useRegister();
  const { data: categoriesData, isLoading } = useCategories();

  // Extract only the categories array from the API response
  const categories = useMemo(() => {
    if (!categoriesData) return [];

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

    return [];
  }, [categoriesData]);

  return (
    <>
      {!isLoading && categories.length > 0 && (
        <Navbar categories={categories} />
      )}
      <Container>
        <Register mutation={createRegisterMutation} />
      </Container>
      {!isLoading && categories.length > 0 && (
        <Footer categories={categories} />
      )}
    </>
  );
};
