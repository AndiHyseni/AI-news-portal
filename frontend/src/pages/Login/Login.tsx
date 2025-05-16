import { Button, Image, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Login/Login.css";
import { useConfiguration } from "../../hooks/useConfiguration/useConfiguration";
import { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import jwtDecode from "jwt-decode";

export interface LoginProps {
  mutation: any;
}

interface JwtPayload {
  id: string;
  roles: string[];
  username: string;
  email: string;
  exp: number;
}

export const Login: React.FC<LoginProps> = ({ mutation }) => {
  const [visible, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();
  const { data } = useConfiguration();
  const [userContext, setUserContext] = useContext(UserContext);

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
        // if (!/[$@#!%&*?]/.test(value)) {
        //   return "Password must contain at least one special character";
        // }
        return null;
      },
    },
  });

  // Monitor login mutation state
  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      const response = mutation.data;

      try {
        // Decode the token to get user details
        const decoded = jwtDecode<JwtPayload>(response.token);

        // Update user context with all necessary information
        setUserContext({
          isAuthenticated: true,
          token: response.token,
          roles: decoded.roles || response.roles || [],
          userId: decoded.id || response.userId,
          username: decoded.username || response.username,
          email: decoded.email || response.email,
        });
      } catch (error) {
        console.error("Error decoding token after login:", error);
      }
    }
  }, [mutation.isSuccess, mutation.data, setUserContext]);

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

      // Store token in localStorage
      localStorage.setItem("jwt", response.token);

      // Navigate and show success message
      setTimeout(() => {
        navigate("/");
        toast.success("Login successful", { autoClose: 2000 });
      }, 100);
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
            className="loginImage"
            src={data?.header_logo}
            height={80}
            width={80}
            radius="md"
          />
          <h1 className="loginH1text">Login</h1>
        </div>
        <Stack className="login" sx={{ maxWidth: 400 }} mx="auto">
          <TextInput
            {...form.getInputProps("email")}
            placeholder="Enter your email address"
            label="Email"
            withAsterisk
            autoComplete="email"
            size="md"
          />
          <PasswordInput
            {...form.getInputProps("password")}
            className="loginpassword"
            placeholder="Enter your password"
            label="Password"
            visible={visible}
            onVisibilityChange={toggle}
            autoComplete="current-password"
            size="md"
          />
          <NavLink to="/forgot-password" className="forgotPass">
            Forgot Password?
          </NavLink>
          <Button className="loginButton" type="submit" size="md">
            Login
          </Button>
        </Stack>
      </form>
    </>
  );
};
