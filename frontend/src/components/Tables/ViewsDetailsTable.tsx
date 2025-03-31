import { Table } from "@mantine/core";
import { ViewsDetails } from "../../types/administration/administration";

export interface TableProps {
  viewsDetails: ViewsDetails[];
}

export const ViewsDetailsTable: React.FC<TableProps> = ({ viewsDetails }) => {
  return (
    <Table
      data-testid="viewsDetails-table"
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
          <th>User Id</th>
          <th>Finger Print Id</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {viewsDetails.map((viewsDetails, index) => (
          <tr key={index}>
            <td>{viewsDetails.newsId}</td>
            <td>{viewsDetails.userId}</td>
            <td>{viewsDetails.fingerPrintId}</td>
            <td>{viewsDetails.watchedOn}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
