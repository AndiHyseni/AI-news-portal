import { Table } from "@mantine/core";
import { ViewsDetails } from "../../types/administration/administration";

export interface TableProps {
  viewsDetails: ViewsDetails[];
}

export const ViewsDetailsTable: React.FC<TableProps> = ({ viewsDetails }) => {
  // Format date from ISO string (2025-05-14T12:13:30.000Z) to DD-MM-YYYY HH:MM:SS
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");

      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  };

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
            <td>{viewsDetails.news_id}</td>
            <td>{viewsDetails.user_id}</td>
            <td>{viewsDetails.finger_print_id}</td>
            <td>{formatDate(viewsDetails.watched_on)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
