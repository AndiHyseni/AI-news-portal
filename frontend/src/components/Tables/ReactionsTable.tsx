import { Button, Table } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Reaction } from "../../types/administration/administration";

export interface TableProps {
  reactions: Reaction[] | any;
}

export const ReactionsTable: React.FC<TableProps> = ({ reactions }) => {
  const navigate = useNavigate();

  // Ensure reactions is an array before mapping
  const reactionsArray = Array.isArray(reactions)
    ? reactions
    : Array.isArray(reactions?.reactions)
    ? reactions.reactions
    : [];

  return (
    <Table
      data-testid="reactions-table"
      highlightOnHover
      verticalSpacing={6}
      style={{ marginTop: 5, marginBottom: 20, textAlign: "center" }}
      sx={() => ({
        backgroundColor: "white",
        boxShadow: "box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.15)",
      })}
    >
      <thead>
        <tr>
          <th>Id</th>
          <th>Sad</th>
          <th>Happy</th>
          <th>Angry</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {reactionsArray.length > 0 ? (
          reactionsArray.map((reaction: Reaction, index: number) => (
            <tr key={index}>
              <td>{reaction.news_id}</td>
              <td>{reaction.sad}</td>
              <td>{reaction.happy}</td>
              <td>{reaction.angry}</td>
              <td>
                <Button
                  onClick={() => navigate(`/reaction/${reaction.news_id}`)}
                >
                  See more
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
              No reactions data available
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};
