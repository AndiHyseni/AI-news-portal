import { Button, Image, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Login/Login.css";
import { useConfiguration } from "../../hooks/useConfiguration/useConfiguration";

export interface LoginProps {
  mutation: any;
}

export const Login: React.FC<LoginProps> = ({ mutation }) => {
  const [visible, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();
  const { data } = useConfiguration();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => {
        if (!value) {
          return "Email is required";
        }
        if (!/^\S+@\S+$/.test(value)) {
          return "Invalid email";
        }
        return null;
      },
      password: (value) => {
        if (!value) {
          return "Password is required";
        }
        if (value.length < 8) {
          return "Password must be at least 8 characters";
        }
        if (!/[A-Z]/.test(value)) {
          return "Password must contain at least one uppercase letter";
        }
        if (!/[a-z]/.test(value)) {
          return "Password must contain at least one lowercase letter";
        }
        if (!/\d/.test(value)) {
          return "Password must contain at least one number";
        }
        if (!/[$@#!%&*?]/.test(value)) {
          return "Password must contain at least one special character";
        }
        return null;
      },
    },
  });

  const handleSubmit = async () => {
    try {
      await mutation.mutateAsync({
        ...form.values,
      });
      navigate("/");
      toast.success("Login successful", { autoClose: 2000 });
    } catch (error) {
      form.setErrors({ password: "Incorrect password" });
      toast.error("Incorrect password", { autoClose: 2000 });
    }
  };

  return (
    <>
      <form className="loginForm" onSubmit={form.onSubmit(handleSubmit)}>
        <div className="loginHeader">
          <Image
            className="registerImage"
            src={data?.headerLogo}
            height={60}
            width={60}
          />
          <h1 className="loginH1text">Login</h1>
        </div>
        <Stack className="login" sx={{ maxWidth: 380 }} mx="auto">
          <TextInput
            {...form.getInputProps("email")}
            placeholder="Enter your email address"
            label="Email"
            withAsterisk
          />
          <PasswordInput
            {...form.getInputProps("password")}
            className="loginpassword"
            placeholder="Enter your password"
            label="Password"
            visible={visible}
            onVisibilityChange={toggle}
          />
          <NavLink to="/forgot-password" className="forgotPass">
            Forgot Password?
          </NavLink>
          <Button className="loginButton" type="submit">
            Login
          </Button>
        </Stack>
      </form>
    </>
  );
};
