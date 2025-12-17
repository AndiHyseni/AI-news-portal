import { Badge, Tooltip } from "@mantine/core";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";

interface VerificationStatusProps {
  isVerified: boolean;
  confidence?: number;
  reason?: string;
  verifiedAt?: string;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({
  isVerified,
  confidence,
  reason,
  verifiedAt,
}) => {
  const getColor = () => {
    if (!verifiedAt) return "gray";
    if (!isVerified) return "red";
    if (confidence && confidence < 0.7) return "yellow";
    return "green";
  };

  const getLabel = () => {
    if (!verifiedAt) return "Unverified";
    if (!isVerified) return "Not Verified";
    if (confidence && confidence < 0.7) return "Partially Verified";
    return "Verified";
  };

  const getTooltip = () => {
    if (!verifiedAt) return "This article has not been verified yet";

    const parts: string[] = [];
    if (typeof confidence === "number") {
      parts.push(`Confidence: ${Math.round(confidence * 100)}%`);
    }
    if (reason) {
      parts.push(reason);
    }
    parts.push(`Verified at: ${new Date(verifiedAt).toLocaleString()}`);

    return parts.join(" • ");
  };

  return (
    <Tooltip label={getTooltip()} position="top">
      <Badge
        color={getColor()}
        size="lg"
        leftSection={
          isVerified ? <IconCheck size={14} /> : <IconAlertCircle size={14} />
        }
      >
        {getLabel()}
      </Badge>
    </Tooltip>
  );
};
