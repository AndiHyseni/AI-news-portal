import { Table } from "@mantine/core";
import { ReactionsDetails } from "../../types/administration/administration";

export interface TableProps {
  reactionsDetails: ReactionsDetails[];
}

export const ReactionsDetailsTable: React.FC<TableProps> = ({
  reactionsDetails,
}) => {
  return (
    <Table
      data-testid="reactionsDetails-table"
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
          <th>News Id</th>
          <th>User</th>
          <th>Reaction</th>
        </tr>
      </thead>
      <tbody>
        {reactionsDetails.map((reactionsDetails, index) => (
          <tr key={index}>
            <td>{reactionsDetails.newsId}</td>
            <td>{reactionsDetails.user.userName}</td>
            <td>
              {(reactionsDetails.reaction === 1 && "Happy") ||
                (reactionsDetails.reaction === 2 && "Sad") ||
                (reactionsDetails.reaction === 3 && "Angry")}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
