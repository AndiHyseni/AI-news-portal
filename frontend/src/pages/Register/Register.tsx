import { Button, Image, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useConfiguration } from "../../hooks/useConfiguration/useConfiguration";
import "../Register/Register.css";

export interface RegisterProps {
  mutation: any;
}

export const Register: React.FC<RegisterProps> = ({ mutation }) => {
  const [visible, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();
  const { data } = useConfiguration();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
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
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  });

  const handleSubmit = () => {
    mutation.mutate(
      {
        ...form.values,
      },
      {
        onSuccess: () => {
          navigate("/login");
        },
      }
    );
  };

  return (
    <>
      <form className="registerForm" onSubmit={form.onSubmit(handleSubmit)}>
        <div className="registerHeader">
          <Image
            className="registerImage"
            src={data?.headerLogo}
            height={60}
            width={60}
          />
          <h1 className="registerH1text">Register</h1>
        </div>
        <Stack className="register" sx={{ maxWidth: 380 }} mx="auto">
          <TextInput
            {...form.getInputProps("email")}
            placeholder="Enter your email address"
            label="Email"
            withAsterisk
          />
          <PasswordInput
            {...form.getInputProps("password")}
            label="Password"
            placeholder="Enter your password"
            visible={visible}
            onVisibilityChange={toggle}
          />
          <PasswordInput
            className="confirmPassword"
            {...form.getInputProps("confirmPassword")}
            label="Confirm password"
            placeholder="Confirm your password"
            visible={visible}
            onVisibilityChange={toggle}
          />
          <Button className="registerButton" type="submit">
            Register
          </Button>
        </Stack>
      </form>
    </>
  );
};
