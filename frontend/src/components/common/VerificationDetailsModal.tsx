import { Modal, Text, List, Badge, Group, Stack, Title } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

interface FactCheck {
  claim: string;
  isFactual: boolean;
  confidence: number;
  explanation: string;
  sources?: string[];
}

interface VerificationDetailsModalProps {
  opened: boolean;
  onClose: () => void;
  verificationData: {
    isVerified: boolean;
    confidence: number;
    factChecks: FactCheck[];
    suggestedCorrections?: string[];
    verificationSources?: string[];
  };
}

export const VerificationDetailsModal: React.FC<
  VerificationDetailsModalProps
> = ({ opened, onClose, verificationData }) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Verification Details"
      size="lg"
    >
      <Stack spacing="md">
        <Group position="apart">
          <Title order={4}>Overall Verification</Title>
          <Badge
            color={verificationData.isVerified ? "green" : "red"}
            size="lg"
            leftSection={
              verificationData.isVerified ? (
                <IconCheck size={14} />
              ) : (
                <IconX size={14} />
              )
            }
          >
            {verificationData.isVerified ? "Verified" : "Not Verified"}
          </Badge>
        </Group>

        <Text>
          Confidence Score: {Math.round(verificationData.confidence * 100)}%
        </Text>

        <Title order={4}>Fact Checks</Title>
        <List spacing="md">
          {verificationData.factChecks.map((check, index) => (
            <List.Item key={index}>
              <Stack spacing="xs">
                <Group position="apart">
                  <Text weight={500}>{check.claim}</Text>
                  <Badge
                    color={check.isFactual ? "green" : "red"}
                    leftSection={
                      check.isFactual ? (
                        <IconCheck size={14} />
                      ) : (
                        <IconX size={14} />
                      )
                    }
                  >
                    {check.isFactual ? "Factual" : "Not Factual"}
                  </Badge>
                </Group>
                <Text size="sm" color="dimmed">
                  {check.explanation}
                </Text>
                {check.sources && check.sources.length > 0 && (
                  <Text size="sm">Sources: {check.sources.join(", ")}</Text>
                )}
              </Stack>
            </List.Item>
          ))}
        </List>

        {verificationData.suggestedCorrections &&
          verificationData.suggestedCorrections.length > 0 && (
            <>
              <Title order={4}>Suggested Corrections</Title>
              <List>
                {verificationData.suggestedCorrections.map(
                  (correction, index) => (
                    <List.Item key={index}>
                      <Text size="sm">{correction}</Text>
                    </List.Item>
                  )
                )}
              </List>
            </>
          )}

        {verificationData.verificationSources &&
          verificationData.verificationSources.length > 0 && (
            <>
              <Title order={4}>Verification Sources</Title>
              <List>
                {verificationData.verificationSources.map((source, index) => (
                  <List.Item key={index}>
                    <Text size="sm">{source}</Text>
                  </List.Item>
                ))}
              </List>
            </>
          )}
      </Stack>
    </Modal>
  );
};
