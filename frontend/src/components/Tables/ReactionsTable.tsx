import { Button, Table } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Reaction } from "../../types/administration/administration";

export interface TableProps {
  reactions: Reaction[];
}

export const ReactionsTable: React.FC<TableProps> = ({ reactions }) => {
  const navigate = useNavigate();

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
        {reactions.map((reactions, index) => (
          <tr key={index}>
            <td>{reactions.newsId}</td>
            <td>{reactions.sad}</td>
            <td>{reactions.happy}</td>
            <td>{reactions.angry}</td>
            <td>
              <Button onClick={() => navigate(`/reaction/${reactions.newsId}`)}>
                See more
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
