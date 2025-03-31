import { Box, Button, Group, Modal, Text } from "@mantine/core";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Users } from "../../types/administration/administration";
import { News, SavedNewsPage } from "../../types/news/news";

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
      : savedNews.userId;

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    mutation.mutate(
      {
        newsId: savedNews.newsId,
        userId: id,
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
