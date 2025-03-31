import {
  Box,
  Button,
  Group,
  Modal,
  PasswordInput,
  Select,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Users } from "../../types/administration/administration";
import { Role } from "../../types/auth/login";
import "../AddUsers/AddUsers.css";

export interface EditUsersModalProps {
  user: Users;
  title: string;
  opened: boolean;
  onClose: () => void;
  mutation: any;
}

export const EditUsersModal: React.FC<EditUsersModalProps> = ({
  user,
  title,
  opened,
  onClose,
  mutation,
}) => {
  const [visible, { toggle }] = useDisclosure(false);

  const [addRole, setAddRole] = useState<string | null>(user.role);

  const roleOptions = [
    { value: Role.ADMIN, label: Role.ADMIN },
    { value: Role.REGISTERED, label: Role.REGISTERED },
  ];

  const form = useForm({
    initialValues: {
      role: user.role,
      userId: user.userId,
      userName: user.userName,
      confirmPassword: "",
      email: user.email,
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

  const handleClose = () => {
    onClose();
    window.location.reload();
  };

  const handleSubmit = () => {
    const errors = form.validate();

    mutation.mutate(
      {
        ...form.values,
        role: String(addRole!),
        userId: form.values.userId,
      },
      {
        onSuccess: () => {
          handleClose();
          window.location.reload();
        },
      }
    );
  };

  return (
    <Modal
      centered
      data-testid="edit-modal"
      size="lg"
      title={title}
      opened={opened}
      onClose={handleClose}
    >
      <Box>
        <form className="createNewsForm" onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            className="addUserElement"
            size="sm"
            required
            label="Name"
            placeholder="Name..."
            {...form.getInputProps("userName")}
          />
          <TextInput
            className="addUserElement"
            size="sm"
            required
            label="Email"
            placeholder="Email..."
            {...form.getInputProps("email")}
          />
          <PasswordInput
            className="addUserElement"
            {...form.getInputProps("password")}
            required
            label="Password"
            placeholder="Enter Password..."
            visible={visible}
            onVisibilityChange={toggle}
          />
          <PasswordInput
            className="addUserElement"
            {...form.getInputProps("confirmPassword")}
            required
            label="Confirm password"
            placeholder="Confirm Password..."
            visible={visible}
            onVisibilityChange={toggle}
          />
          <Select
            className="addUserElement"
            label="Role"
            placeholder="Role..."
            defaultValue={user.role}
            data={roleOptions}
            searchable
            maxDropdownHeight={400}
            required
            onChange={(addRole) => setAddRole(addRole)}
          />
          <Group position="right" mt="md">
            <Button
              data-testid="submit-button"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <Button
              color="red"
              data-testid="submit-button"
              type="button"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Group>
        </form>
      </Box>
    </Modal>
  );
};
