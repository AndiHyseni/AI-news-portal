import { Box, Button, Group, Modal, Text } from "@mantine/core";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "tabler-icons-react";
import { Users } from "../../types/administration/administration";
import { SavedNewsPage } from "../../types/news/news";
import "./Modals.css";

export interface DeleteSavedNewsModalProps {
  savedNews: SavedNewsPage;
  userId: Users;
  title: string;
  text: string;
  opened: boolean;
  mutation: any;
  onClose: () => void;
}

export const DeleteSavedNewsModal: React.FC<DeleteSavedNewsModalProps> = ({
  savedNews,
  userId,
  title,
  text,
  opened,
  mutation,
  onClose,
}) => {
  const navigate = useNavigate();

  var token: any =
    localStorage.getItem("jwt") != null
      ? jwtDecode(localStorage.getItem("jwt")!)
      : null;

  var id: string =
    token != null
      ? token[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ]
      : savedNews.user_id;

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    mutation.mutate(
      {
        news_id: savedNews.news_id,
        user_id: id,
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
      classNames={{
        modal: "custom-modal",
        title: "modal-title",
      }}
      data-testid="delete-saved-news-modal"
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

        <Text className="confirmation-text">{text}</Text>

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
            Remove from Saved
          </Button>
        </div>
      </Box>
    </Modal>
  );
};
