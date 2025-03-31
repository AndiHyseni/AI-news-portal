import { Container } from "@mantine/core";
import { useLogin } from "../../hooks/useAuth/useLogin";
import { useCategories } from "../../hooks/useCategories/useCategories";
import { Login } from "../../pages/Login/Login";
import { Footer } from "../Footer/Footer";
import { Navbar } from "../Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const LoginPage: React.FC = () => {
  const createLoginMutation = useLogin();
  const { data } = useCategories();

  return (
    <>
      {data && <Navbar categories={data} />}
      <Container>
        <Login mutation={createLoginMutation} />
        <ToastContainer />
      </Container>
      {data && <Footer categories={data} />}
    </>
  );
};
