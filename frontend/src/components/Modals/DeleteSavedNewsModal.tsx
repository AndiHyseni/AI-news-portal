import { Box, Button, Group, Modal, Text } from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";
import { SavedNewsPage } from "../../types/news/news";
import { UserContext } from "../../contexts/UserContext";
import { useContext } from "react";
import { toast } from "react-toastify";
import "./Modals.css";

export interface DeleteSavedNewsModalProps {
  savedNews: SavedNewsPage;
  title: string;
  text: string;
  opened: boolean;
  mutation: any;
  onClose: () => void;
  onDeleteSuccess?: (newsId: string) => void;
}

export const DeleteSavedNewsModal: React.FC<DeleteSavedNewsModalProps> = ({
  savedNews,
  title,
  text,
  opened,
  mutation,
  onClose,
  onDeleteSuccess,
}) => {
  const [userContext] = useContext(UserContext);

  // Use user ID from context or fallback to savedNews user_id
  const actualUserId = userContext.userId || savedNews.user_id;

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    // Show loading toast
    const toastId = toast.loading("Removing article from saved list...");

    // Ensure both news_id and user_id are included in the payload
    const deletePayload = {
      news_id: savedNews.news_id,
      user_id: actualUserId,
    };

    mutation.mutate(deletePayload, {
      onSuccess: () => {
        // Update toast to success
        toast.update(toastId, {
          render: "Article removed from your saved list successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        // Update local state in parent component
        if (onDeleteSuccess) {
          onDeleteSuccess(savedNews.news_id);
        } else {
          // Just close the modal if no callback provided
          handleClose();
        }
      },
      onError: (error: any) => {
        console.error("Error payload:", deletePayload);
        console.error("Error removing saved news:", error);

        // Update toast to error
        toast.update(toastId, {
          render: "Failed to remove article. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
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
