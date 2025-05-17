import {
  Paper,
  Table,
  Text,
  Badge,
  Group,
  Avatar,
  Button,
} from "@mantine/core";
import { MoodNeutral, MoodSmile, MoodSad, MoodAngry } from "tabler-icons-react";
import "./Tables.css";
import { useNavigate } from "react-router-dom";

interface ReactionRecord {
  id: string;
  news_id: string;
  user_id: string;
  reaction: number; // 1 = happy, 2 = sad, 3 = angry
  news?: {
    id: string;
    title: string;
  };
}

interface AggregatedReaction {
  news_id: string;
  news_title: string;
  happy: number;
  sad: number;
  angry: number;
}

export interface TableProps {
  reactions: ReactionRecord[] | { reactions: ReactionRecord[] };
}

export const ReactionsTable: React.FC<TableProps> = ({ reactions }) => {
  const navigate = useNavigate();
  const reactionsArray = Array.isArray(reactions)
    ? reactions
    : reactions.reactions || [];

  // Aggregate reactions by news_id
  const aggregatedReactions = reactionsArray.reduce(
    (acc: { [key: string]: AggregatedReaction }, curr) => {
      if (!acc[curr.news_id]) {
        acc[curr.news_id] = {
          news_id: curr.news_id,
          news_title: curr.news?.title || curr.news_id,
          happy: 0,
          sad: 0,
          angry: 0,
        };
      }

      // Increment the appropriate counter based on reaction type
      switch (curr.reaction) {
        case 1:
          acc[curr.news_id].happy++;
          break;
        case 2:
          acc[curr.news_id].sad++;
          break;
        case 3:
          acc[curr.news_id].angry++;
          break;
      }

      return acc;
    },
    {}
  );

  const getTotalReactions = (reaction: AggregatedReaction) => {
    return reaction.happy + reaction.sad + reaction.angry;
  };

  const aggregatedReactionsArray = Object.values(aggregatedReactions);

  return (
    <>
      <Text className="table-title" size="xl" weight={600} mb="md">
        Reactions Summary
      </Text>

      {aggregatedReactionsArray && aggregatedReactionsArray.length > 0 ? (
        <Table
          data-testid="reactions-table"
          highlightOnHover
          verticalSpacing="md"
          horizontalSpacing="lg"
          className="custom-table"
        >
          <thead className="table-header">
            <tr>
              <th>News Title</th>
              <th>Happy</th>
              <th>Sad</th>
              <th>Angry</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {aggregatedReactionsArray.map((reaction) => (
              <tr key={reaction.news_id} className="table-row">
                <td>
                  <Text weight={500} size="sm" lineClamp={2}>
                    {reaction.news_title}
                  </Text>
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
                <td>
                  <Button
                    variant="light"
                    color="blue"
                    size="xs"
                    onClick={() =>
                      navigate(`/admin/reactions/${reaction.news_id}`)
                    }
                  >
                    Details
                  </Button>
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
