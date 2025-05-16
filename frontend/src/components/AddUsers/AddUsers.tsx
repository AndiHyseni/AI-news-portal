import {
  Box,
  Button,
  Container,
  Paper,
  PasswordInput,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddUser } from "../../hooks/useUsers/useAddUser";
import { Role, RoleIds } from "../../types/auth/login";
import "./AddUsers.css";

export const AddUsers: React.FC = () => {
  const navigate = useNavigate();
  const addUserMutation = useAddUser();
  const [visible, { toggle }] = useDisclosure(false);

  const [addRole, setAddRole] = useState<string | null>(
    RoleIds.REGISTERED.toString()
  );

  const roleOptions = [
    { value: RoleIds.ADMIN.toString(), label: Role.ADMIN },
    { value: RoleIds.REGISTERED.toString(), label: Role.REGISTERED },
  ];

  const form = useForm({
    initialValues: {
      role: RoleIds.REGISTERED.toString(),
      userName: "",
      confirmPassword: "",
      email: "",
      password: "",
    },
    validate: {
      userName: (value) => {
        if (!value) {
          return "Name is required";
        }
        return null;
      },
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
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  });

  const handleSubmit = () => {
    const errors = form.validate();

    if (errors.hasErrors) {
      return;
    }

    addUserMutation.mutate(
      {
        id: "",
        username: form.values.userName,
        email: form.values.email,
        password: form.values.password,
        role: addRole!,
      },
      {
        onSuccess: () => {
          navigate("/users");
        },
        onError: (error) => {
          console.error("Error adding user:", error);
        },
      }
    );
  };

  return (
    <Container size="md" py="xl">
      <Paper shadow="md" radius="md" p="xl" className="user-form-container">
        <Title order={2} className="form-title">
          Add New User
        </Title>

        <Box mt="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <div className="form-group">
              <TextInput
                className="form-element"
                size="md"
                required
                label="Full Name"
                placeholder="Enter user's full name"
                {...form.getInputProps("userName")}
                error={form.errors.userName}
              />

              <TextInput
                className="form-element"
                size="md"
                required
                label="Email Address"
                placeholder="Enter email address"
                {...form.getInputProps("email")}
                error={form.errors.email}
              />

              <PasswordInput
                className="form-element"
                size="md"
                required
                label="Password"
                placeholder="Enter password"
                {...form.getInputProps("password")}
                visible={visible}
                onVisibilityChange={toggle}
                error={form.errors.password}
              />

              <PasswordInput
                className="form-element"
                size="md"
                required
                label="Confirm Password"
                placeholder="Confirm password"
                {...form.getInputProps("confirmPassword")}
                visible={visible}
                onVisibilityChange={toggle}
                error={form.errors.confirmPassword}
              />

              <Select
                className="form-element"
                size="md"
                label="User Role"
                placeholder="Select user role"
                data={roleOptions}
                searchable
                required
                value={addRole}
                onChange={(value) => {
                  setAddRole(value);
                  form.setFieldValue("role", value || "");
                }}
              />
            </div>

            <div className="action-buttons">
              <Button
                className="cancel-button"
                variant="outline"
                onClick={() => navigate("/users")}
              >
                Cancel
              </Button>

              <Button
                className="submit-button"
                type="submit"
                loading={addUserMutation.isLoading}
              >
                Create User
              </Button>
            </div>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};
