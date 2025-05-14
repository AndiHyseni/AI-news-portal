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
import { useState, useEffect } from "react";
import { Users } from "../../types/administration/administration";
import { Role, RoleIds } from "../../types/auth/login";
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

  // Map role name to role ID
  const getRoleId = (roleName: string): string => {
    // Default to REGISTERED if roleName is undefined or null
    if (!roleName) {
      return RoleIds.REGISTERED.toString();
    }

    switch (roleName.toLowerCase()) {
      case Role.ADMIN?.toLowerCase():
        return RoleIds.ADMIN.toString();
      case Role.REGISTERED?.toLowerCase():
        return RoleIds.REGISTERED.toString();
      default:
        return RoleIds.REGISTERED.toString();
    }
  };

  // Extract role from array if it's an array, otherwise use as is, with fallback
  const getUserRole = (user: Users): string => {
    const roleName = Array.isArray(user.role)
      ? user.role.length > 0
        ? user.role[0]
        : Role.REGISTERED
      : user.role || Role.REGISTERED;

    return getRoleId(roleName);
  };

  const [addRole, setAddRole] = useState<string | null>(getUserRole(user));

  const roleOptions = [
    { value: RoleIds.ADMIN.toString(), label: Role.ADMIN },
    { value: RoleIds.REGISTERED.toString(), label: Role.REGISTERED },
  ];

  const form = useForm({
    initialValues: {
      role: getUserRole(user),
      user_id: user.id,
      name: user.name,
      confirmPassword: "",
      email: user.email,
      password: "",
    },
    validate: {
      name: (value) => {
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

  // Reset form when modal opens with new user data
  useEffect(() => {
    if (opened) {
      const roleId = getUserRole(user);

      // Reset form with the new user's data
      form.setValues({
        role: roleId,
        user_id: user.id,
        name: user.name,
        confirmPassword: "",
        email: user.email,
        password: "",
      });

      setAddRole(roleId);
    }
  }, [opened, user]);

  const handleClose = () => {
    // Reset form when closing
    form.reset();
    setAddRole(null);
    onClose();
  };

  const handleSubmit = () => {
    const errors = form.validate();

    if (errors.hasErrors) {
      return;
    }

    // Ensure we have a role value
    if (!addRole) {
      console.error("Role is missing");
      return;
    }

    const payload = {
      id: form.values.user_id,
      username: form.values.name,
      email: form.values.email,
      password: form.values.password,
      role: addRole,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        handleClose();
      },
      onError: (error: any) => {
        console.error("Error updating user:", error);
      },
    });
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
            {...form.getInputProps("name")}
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
            value={addRole}
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
