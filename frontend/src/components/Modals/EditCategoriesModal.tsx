import {
  Box,
  Button,
  Group,
  Modal,
  Switch,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { Categories } from "../../types/categories/categories";
import "./Modals.css";

export interface EditCategoriesModalProps {
  categories: Categories;
  title: string;
  opened: boolean;
  onClose: () => void;
  mutation: any;
}

export const EditCategoriesModal: React.FC<EditCategoriesModalProps> = ({
  categories,
  title,
  opened,
  onClose,
  mutation,
}) => {
  const [showOnline, setShowOnline] = useState<boolean>(
    Boolean(categories.show_online)
  );

  const form = useForm({
    initialValues: {
      id: categories.id,
      name: categories.name,
      description: categories.description,
      show_online: Boolean(categories.show_online),
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

  useEffect(() => {
    if (opened) {
      form.setValues({
        id: categories.id,
        name: categories.name,
        description: categories.description,
        show_online: Boolean(categories.show_online),
      });
      setShowOnline(Boolean(categories.show_online));
    }
  }, [categories, opened]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    const errors = form.validate();
    if (errors.hasErrors) return;

    mutation.mutate(
      {
        ...form.values,
        id: categories.id,
        show_online: Boolean(showOnline),
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
      data-testid="edit-category-modal"
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
              onClick={handleSubmit}
              loading={mutation.isLoading}
            >
              Update Category
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};
