import { Paper, Table, Text, Badge, Group, Avatar } from "@mantine/core";
import { Reaction } from "../../types/administration/administration";
import { MoodNeutral, MoodSmile, MoodSad, MoodAngry } from "tabler-icons-react";
import "./Tables.css";

export interface TableProps {
  reactions: Reaction[];
}

interface ReactionsResponse {
  statusCode: string;
  statusIsOk: boolean;
  statusMessage: string;
  statusPath: string;
  statusDate: string;
  reactions: any[];
}

export const ReactionsTable: React.FC<TableProps> = ({ reactions }) => {
  const reactionsArray = Array.isArray(reactions)
    ? reactions
    : (reactions as ReactionsResponse).reactions || [];

  const getTotalReactions = (reaction: Reaction) => {
    return reaction.happy + reaction.sad + reaction.angry;
  };

  return (
    <>
      <Text className="table-title" size="xl" weight={600} mb="md">
        Reactions Summary
      </Text>

      {reactionsArray && reactionsArray.length > 0 ? (
        <Table
          data-testid="reactions-table"
          highlightOnHover
          verticalSpacing="md"
          horizontalSpacing="lg"
          className="custom-table"
        >
          <thead className="table-header">
            <tr>
              <th>News ID</th>
              <th>Happy</th>
              <th>Sad</th>
              <th>Angry</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {reactionsArray.map((reaction, index) => (
              <tr key={index} className="table-row">
                <td>
                  <Badge color="indigo" variant="light" radius="sm">
                    {reaction.news_id}
                  </Badge>
                </td>
                <td>
                  <Group spacing="xs">
                    <Avatar color="green" radius="xl" size="sm">
                      <MoodSmile size={16} />
                    </Avatar>
                    <Text weight={500}>{reaction.happy}</Text>
                  </Group>
                </td>
                <td>
                  <Group spacing="xs">
                    <Avatar color="blue" radius="xl" size="sm">
                      <MoodSad size={16} />
                    </Avatar>
                    <Text weight={500}>{reaction.sad}</Text>
                  </Group>
                </td>
                <td>
                  <Group spacing="xs">
                    <Avatar color="red" radius="xl" size="sm">
                      <MoodAngry size={16} />
                    </Avatar>
                    <Text weight={500}>{reaction.angry}</Text>
                  </Group>
                </td>
                <td>
                  <Badge size="lg" radius="md" color="grape">
                    {getTotalReactions(reaction)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <MoodNeutral size={48} />
          </div>
          <Text className="empty-state-text">No reaction data available</Text>
        </div>
      )}
    </>
  );
};
