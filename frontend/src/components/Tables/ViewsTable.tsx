import { Button, Table } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Views } from "../../types/administration/administration";

export interface TableProps {
  views: Views[] | any;
}

export const ViewsTable: React.FC<TableProps> = ({ views }) => {
  const navigate = useNavigate();

  // Ensure views is an array before trying to sort it
  const viewsArray = Array.isArray(views.views) ? views.views : [];

  const sortedMostWatched =
    viewsArray.length > 0
      ? [...viewsArray].sort((a, b) => b.nrOfClicks - a.nrOfClicks)
      : [];

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
          <th>News Title</th>
          <th>Number of Clicks</th>
          <th>See Details</th>
        </tr>
      </thead>
      <tbody>
        {sortedMostWatched.map((view, index) => (
          <tr key={index}>
            <td>{view.NewsTitle}</td>
            <td>{view.nrOfClicks}</td>
            <td>
              <Button onClick={() => navigate(`/views/${view.id}`)}>
                See more
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
