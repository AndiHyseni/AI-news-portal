import { Button, Table } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { Views } from "../../types/administration/administration";

export interface TableProps {
  views: Views[];
}

export const ViewsTable: React.FC<TableProps> = ({ views }) => {
  const navigate = useNavigate();

  const sortedMostWatched = [...views].sort(
    (a, b) => b.nrOfClicks - a.nrOfClicks
  );

  return (
    <Table
      data-testid="views-table"
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
          <th>News Title</th>
          <th>Number of Clicks</th>
          <th>See Details</th>
        </tr>
      </thead>
      <tbody>
        {sortedMostWatched.map((views, index) => (
          <tr key={index}>
            <td>{views.id}</td>
            <td>{views.newsTitle}</td>
            <td>{views.nrOfClicks}</td>
            <td>
              <Button onClick={() => navigate(`/views/${views.id}`)}>
                See more
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
