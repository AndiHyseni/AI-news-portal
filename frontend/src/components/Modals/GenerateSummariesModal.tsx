import { Button, Group, Modal, Text } from "@mantine/core";
import { UseMutationResult } from "@tanstack/react-query";

interface GenerateSummariesModalProps {
  opened: boolean;
  onClose: () => void;
  mutation: UseMutationResult<any, unknown, void, unknown>;
  apiSource?: string;
}

export const GenerateSummariesModal: React.FC<GenerateSummariesModalProps> = ({
  opened,
  onClose,
  mutation,
  apiSource = "OpenAI",
}) => {
  const handleConfirm = () => {
    mutation.mutate();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Generate Summaries with ${apiSource}`}
      centered
    >
      <Text size="sm" style={{ marginBottom: 20 }}>
        This will generate summaries for all articles that don't already have
        one using {apiSource}.
        {apiSource === "NLP"
          ? " This process uses Natural Language Processing to extract the most important information from your articles."
          : " The process may take a while depending on the number of articles."}
        Do you want to continue?
      </Text>

      <Group position="right" spacing="md">
        <Button variant="outline" color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="teal"
          onClick={handleConfirm}
          loading={mutation.isLoading}
        >
          Generate Summaries
        </Button>
      </Group>
    </Modal>
  );
};
