import { Button, Table } from "@mantine/core";
import { Link } from "react-router-dom";
import { News } from "../../types/news/news";

export interface TableProps {
  newses: News[];
}

export const NewsTable: React.FC<TableProps> = ({ newses }) => {
  return (
    <Table
      data-testid="news-table"
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
          <th>Category</th>
          <th>Title</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {newses.map((news, index) => (
          <tr key={index}>
            <td>{news.newsId}</td>
            <td>{news.categoryId}</td>
            <td>{news.title}</td>
            <td>
              <Button component={Link} to={`/news/details/${news.newsId}`}>
                Details
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
