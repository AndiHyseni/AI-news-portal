import { Box, Button, Group, Modal, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Users } from "../../types/administration/administration";

export interface DeleteUsersModalProps {
  users: Users;
  title: string;
  text: string;
  opened: boolean;
  mutation: any;
  onClose: () => void;
}

export const DeleteUsersModal: React.FC<DeleteUsersModalProps> = ({
  users,
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
    mutation.mutate(users.userId, {
      onSuccess: () => {
        handleClose();
        navigate("/users");
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
