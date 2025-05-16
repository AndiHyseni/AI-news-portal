import { Container } from "@mantine/core";
import { useLogin } from "../../hooks/useAuth/useLogin";
import { useCategories } from "../../hooks/useCategories/useCategories";
import { Login } from "../../pages/Login/Login";
import { Footer } from "../Footer/Footer";
import { Navbar } from "../Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMemo } from "react";
import { Categories } from "../../types/categories/categories";

export const LoginPage: React.FC = () => {
  const createLoginMutation = useLogin();
  const { data } = useCategories();

  // Extract only the categories array from the API response
  const categories = useMemo(() => {
    if (!data) return [];

    // If data is already an array, assume it's the categories array
    if (Array.isArray(data)) {
      return data;
    }

    // If data is an object with a categories property
    if (data && typeof data === "object" && "categories" in data) {
      return (data as { categories: Categories[] }).categories;
    }

    // If we have a single category object, wrap it in an array
    if (data && typeof data === "object") {
      return [data as Categories];
    }

    return [];
  }, [data]);

  return (
    <>
      <Navbar categories={categories} />
      <Container>
        <Login mutation={createLoginMutation} />
        <ToastContainer />
      </Container>
      <Footer categories={categories} />
    </>
  );
};
