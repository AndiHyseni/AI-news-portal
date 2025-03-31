import { Container } from "@mantine/core";
import { useRegister } from "../../hooks/useAuth/useRegister";
import { useCategories } from "../../hooks/useCategories/useCategories";
import { Register } from "../../pages/Register/Register";
import { Footer } from "../Footer/Footer";
import { Navbar } from "../Navbar/Navbar";

export const RegisterPage: React.FC = () => {
  const createRegisterMutation = useRegister();
  const { data } = useCategories();

  return (
    <>
      {data && <Navbar categories={data} />}
      <Container>
        <Register mutation={createRegisterMutation} />
      </Container>
      {data && <Footer categories={data} />}
    </>
  );
};
