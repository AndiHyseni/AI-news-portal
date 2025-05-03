import { Button, Table } from "@mantine/core";
import { Link } from "react-router-dom";
import { News } from "../../types/news/news";

type NewsResponse = News[] | { news: News[] };

export interface TableProps {
  newses: NewsResponse;
}

export const NewsTable: React.FC<TableProps> = ({ newses }) => {
  // Ensure newses is an array
  const newsArray = Array.isArray(newses)
    ? newses
    : (newses as { news: News[] })?.news || [];

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
        {newsArray.map((news, index) => (
          <tr key={index}>
            <td>{news.id}</td>
            <td>{news.category_id}</td>
            <td>{news.title}</td>
            <td>
              <Button component={Link} to={`/news/details/${news.id}`}>
                Details
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
