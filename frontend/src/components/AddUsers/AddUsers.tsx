import {
  Box,
  Button,
  Group,
  PasswordInput,
  Select,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddUser } from "../../hooks/useUsers/useAddUser";
import "../AddUsers/AddUsers.css";

export const AddUsers: React.FC = () => {
  const navigate = useNavigate();
  const addUserMutation = useAddUser();
  const [visible, { toggle }] = useDisclosure(false);

  const [addRole, setAddRole] = useState<string | null>("Registered");

  const roleOptions = [
    { value: "Admin", label: "Admin" },
    { value: "Registered", label: "Registered" },
  ];

  const form = useForm({
    initialValues: {
      role: "",
      userId: "",
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
    addUserMutation.mutate(
      {
        ...form.values,
        role: addRole!,
        userId: form.values.userId,
      },
      {
        onSuccess: () => {
          navigate("/users");
        },
      }
    );
  };

  return (
    <Box>
      <form className="addUserForm" onSubmit={form.onSubmit(handleSubmit)}>
        <h1 className="addUserHeader">Add User</h1>
        <hr />
        <TextInput
          className="addUserElement"
          size="sm"
          label="Name"
          placeholder="Name..."
          {...form.getInputProps("userName")}
        />
        <TextInput
          className="addUserElement"
          size="sm"
          label="Email"
          placeholder="Email..."
          {...form.getInputProps("email")}
        />
        <PasswordInput
          className="addUserElement"
          {...form.getInputProps("password")}
          label="Password"
          placeholder="Enter Password..."
          visible={visible}
          onVisibilityChange={toggle}
        />
        <PasswordInput
          className="addUserElement"
          {...form.getInputProps("confirmPassword")}
          label="Confirm password"
          placeholder="Confirm Password..."
          visible={visible}
          onVisibilityChange={toggle}
        />
        <Select
          className="addUserElement"
          label="Role"
          placeholder="Role..."
          data={roleOptions}
          {...form.getInputProps("role")}
          searchable
          maxDropdownHeight={400}
          value={addRole}
          onChange={(addRole) => setAddRole(addRole)}
        />

        <Group className="addUserButtons">
          <Button color={"red"} onClick={() => navigate("/users")}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
};
