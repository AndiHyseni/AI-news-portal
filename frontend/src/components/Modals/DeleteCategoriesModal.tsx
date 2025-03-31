import { Box, Button, Group, Modal, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Categories } from "../../types/categories/categories";

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
    mutation.mutate(category.categoryId, {
      onSuccess: () => {
        handleClose();
        navigate("/Category");
      },
    });
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
        <Text size="sm">{text}</Text>
        <Group position="right" mt="md">
          <Button
            data-testid="submit-button"
            type="button"
            onClick={handleSubmit}
          >
            Yes
          </Button>
          <Button
            color="red"
            data-testid="submit-button"
            type="button"
            onClick={handleClose}
          >
            No
          </Button>
        </Group>
      </Box>
    </Modal>
  );
};
