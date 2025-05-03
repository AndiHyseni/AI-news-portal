import { Button, Image, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Login/Login.css";
import { useConfiguration } from "../../hooks/useConfiguration/useConfiguration";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

export interface LoginProps {
  mutation: any;
}

export const Login: React.FC<LoginProps> = ({ mutation }) => {
  const [visible, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();
  const { data } = useConfiguration();
  const [, setUserContext] = useContext(UserContext);

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
      const response = await mutation.mutateAsync({
        ...form.values,
      });

      // Check if we have a valid token
      if (
        !response ||
        !response.token ||
        response.token === "undefined" ||
        response.token === "null"
      ) {
        toast.error("Invalid response from server", { autoClose: 2000 });
        return;
      }

      // Set user context manually since we're not using the hook's callback
      setUserContext({
        isAuthenticated: true,
        token: response.token,
        roles: response.roles || [],
        userId: response.userId,
        username: response.username,
        email: response.email,
      });

      localStorage.setItem("jwt", response.token);
      navigate("/");
      toast.success("Login successful", { autoClose: 2000 });
    } catch (error: any) {
      console.error("Login error:", error);

      // Check for specific validation error messages from the API
      if (error.message) {
        if (error.message.toLowerCase().includes("password")) {
          form.setErrors({ password: error.message });
        } else if (error.message.toLowerCase().includes("email")) {
          form.setErrors({ email: error.message });
        } else {
          // Generic error handling
          form.setErrors({ password: "Authentication failed" });
        }

        toast.error(error.message || "Login failed", { autoClose: 3000 });
      } else {
        // Fallback generic error
        form.setErrors({ password: "Incorrect password" });
        toast.error("Authentication failed", { autoClose: 2000 });
      }
    }
  };

  return (
    <>
      <form className="loginForm" onSubmit={form.onSubmit(handleSubmit)}>
        <div className="loginHeader">
          <Image
            className="registerImage"
            src={data?.header_logo}
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
            autoComplete="email"
          />
          <PasswordInput
            {...form.getInputProps("password")}
            className="loginpassword"
            placeholder="Enter your password"
            label="Password"
            visible={visible}
            onVisibilityChange={toggle}
            autoComplete="current-password"
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
