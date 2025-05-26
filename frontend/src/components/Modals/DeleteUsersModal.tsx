import { Box, Button, Group, Modal, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "tabler-icons-react";
import { Users } from "../../types/administration/administration";
import "./Modals.css";

export interface DeleteUsersModalProps {
  user: Users;
  title: string;
  text: string;
  opened: boolean;
  mutation: any;
  onClose: () => void;
}

export const DeleteUsersModal: React.FC<DeleteUsersModalProps> = ({
  user,
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
    mutation.mutate(user.id, {
      onSuccess: () => {
        handleClose();
        navigate("/admin/users");
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
      data-testid="delete-user-modal"
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
          {text} <strong>{user.name}</strong> ({user.email})?
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
            Remove User
          </Button>
        </div>
      </Box>
    </Modal>
  );
};
