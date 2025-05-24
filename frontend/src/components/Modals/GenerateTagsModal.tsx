import { Button, Group, Modal, Text } from "@mantine/core";
import { UseMutationResult } from "@tanstack/react-query";

interface GenerateTagsModalProps {
  opened: boolean;
  onClose: () => void;
  mutation: UseMutationResult<any, unknown, void, unknown>;
  model: string;
}

export const GenerateTagsModal: React.FC<GenerateTagsModalProps> = ({
  opened,
  onClose,
  mutation,
  model,
}) => {
  const handleGenerateTags = async () => {
    try {
      await mutation.mutateAsync();
      onClose();
    } catch (error) {
      console.error("Error generating tags:", error);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text size="lg">Generate Tags with {model}</Text>}
      centered
    >
      <Text size="sm" mb={20}>
        This will generate tags for all news articles that don't have tags using
        the {model} model. This process uses Natural Language Processing to
        extract the most relevant keywords from your articles.
      </Text>

      <Group position="right" mt="md">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleGenerateTags}
          loading={mutation.isLoading}
          color="indigo"
        >
          Generate Tags
        </Button>
      </Group>
    </Modal>
  );
};
