import {
  Box,
  Button,
  Group,
  Modal,
  Switch,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useCreateCategories } from "../../hooks/useCategories/useCreateCategories";
import "./Modals.css";

export interface CreateCategoriesModalProps {
  title: string;
  opened: boolean;
  onClose: () => void;
}

export const CreateCategoriesModal: React.FC<CreateCategoriesModalProps> = ({
  title,
  opened,
  onClose,
}) => {
  const createCategoriesMutation = useCreateCategories();
  const [showOnline, setShowOnline] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      showOnline: false,
    },
    validate: {
      name: (value) => {
        if (!value) {
          return "Name is required";
        }
        return null;
      },
      description: (value) => {
        if (!value) {
          return "Description is required";
        }
        if (value.length < 20) {
          return "Description must have at least 20 characters";
        }
        return null;
      },
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = () => {
    const errors = form.validate();
    if (errors.hasErrors) return;

    createCategoriesMutation.mutate(
      {
        name: form.values.name,
        description: form.values.description,
        show_online: showOnline,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  return (
    <Modal
      centered
      classNames={{
        modal: "custom-modal",
        title: "modal-title",
      }}
      data-testid="create-category-modal"
      size="lg"
      title={title}
      opened={opened}
      onClose={handleClose}
    >
      <Box className="modal-content">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <div className="form-group">
            <TextInput
              className="form-element"
              size="md"
              required
              label="Category Name"
              placeholder="Enter category name..."
              {...form.getInputProps("name")}
              error={form.errors.name}
              styles={{
                label: { className: "form-label" },
              }}
            />

            <Textarea
              className="form-element"
              size="md"
              required
              label="Description"
              placeholder="Enter category description (min. 20 characters)..."
              minRows={4}
              {...form.getInputProps("description")}
              error={form.errors.description}
              styles={{
                label: { className: "form-label" },
              }}
            />

            <div className="custom-switch">
              <Switch
                label="Make this category visible to users"
                checked={showOnline}
                onChange={(event) => setShowOnline(event.currentTarget.checked)}
                size="md"
                color="violet"
              />
            </div>
          </div>

          <div className="action-buttons">
            <Button
              className="cancel-button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>

            <Button
              className="submit-button"
              type="submit"
              loading={createCategoriesMutation.isLoading}
            >
              Create Category
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};
