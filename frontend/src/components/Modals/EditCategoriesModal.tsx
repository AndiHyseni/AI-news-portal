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
import { useState } from "react";
import { Categories } from "../../types/categories/categories";

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
  const [showOnline, setShowOnline] = useState<boolean>(categories.showOnline);

  const form = useForm({
    initialValues: {
      categoryId: categories.categoryId,
      name: categories.name,
      description: categories.description,
      showOnline: categories.showOnline,
    },
    validate: {
      name: (value) => {
        if (!value) {
          return "Name is required";
        }
      },
      description: (value) => {
        if (!value) {
          return "Description is required";
        }
        if (value.length < 20) {
          return "Description must have at least 20 characters";
        }
      },
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
        categoryId: categories.categoryId,
        showOnline: showOnline,
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
      data-testid="delete-modal"
      size="lg"
      title={title}
      opened={opened}
      onClose={handleClose}
    >
      <Box>
        <form className="createNewsForm" onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            className="createCategoriesElement"
            size="sm"
            required
            label="Name"
            placeholder="Name..."
            {...form.getInputProps("name")}
          />
          <Textarea
            className="createCategoriesElement"
            size="sm"
            required
            label="Description"
            placeholder="Description..."
            {...form.getInputProps("description")}
          />
          <Switch
            label="Show Online"
            checked={showOnline}
            onChange={(event) => setShowOnline(event.currentTarget.checked)}
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
