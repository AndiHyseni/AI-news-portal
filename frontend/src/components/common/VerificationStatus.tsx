import { Badge, Tooltip } from "@mantine/core";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";

interface VerificationStatusProps {
  isVerified: boolean;
  confidence?: number;
  onClick?: () => void;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({
  isVerified,
  confidence,
  onClick,
}) => {
  const getColor = () => {
    if (!isVerified) return "red";
    if (confidence && confidence < 0.7) return "yellow";
    return "green";
  };

  const getLabel = () => {
    if (!isVerified) return "Unverified";
    if (confidence && confidence < 0.7) return "Partially Verified";
    return "Verified";
  };

  const getTooltip = () => {
    if (!isVerified) return "This article has not been verified";
    if (confidence) {
      return `Verification confidence: ${Math.round(confidence * 100)}%`;
    }
    return "This article has been verified";
  };

  return (
    <Tooltip label={getTooltip()} position="top">
      <Badge
        color={getColor()}
        size="lg"
        leftSection={
          isVerified ? <IconCheck size={14} /> : <IconAlertCircle size={14} />
        }
        onClick={onClick}
        style={{ cursor: onClick ? "pointer" : "default" }}
      >
        {getLabel()}
      </Badge>
    </Tooltip>
  );
};
