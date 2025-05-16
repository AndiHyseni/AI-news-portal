import { Box, Button, Group, Modal, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Categories } from "../../types/categories/categories";
import { AlertCircle } from "tabler-icons-react";
import "./Modals.css";

export interface DeleteCategoriesModalProps {
  category: Categories;
  title: string;
  text: string;
  opened: boolean;
  mutation: any;
  onClose: () => void;
}

export const DeleteCategoriesModal: React.FC<DeleteCategoriesModalProps> = ({
  category,
  title,
  text,
  opened,
  mutation,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    mutation.mutate(category.id, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <Modal
      centered
      classNames={{
        modal: "custom-modal",
        title: "modal-title",
      }}
      data-testid="delete-category-modal"
      size="md"
      title={title}
      opened={opened}
      onClose={handleClose}
    >
      <Box className="modal-content">
        <div className="modal-danger">
          <Group>
            <AlertCircle size={24} color="#dc3545" />
            <Text size="md" weight={600} color="#842029">
              Warning: This action cannot be undone
            </Text>
          </Group>
        </div>

        <Text className="confirmation-text">
          {text} <strong>{category.name}</strong>?
        </Text>

        <div className="action-buttons">
          <Button
            className="cancel-button"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            className="delete-button"
            onClick={handleSubmit}
            loading={mutation.isLoading}
          >
            Delete Category
          </Button>
        </div>
      </Box>
    </Modal>
  );
};
