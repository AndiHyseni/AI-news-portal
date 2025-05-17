import { Button, Table, Text, Badge } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { News } from "../../types/news/news";
import "./Tables.css";
import { CirclePlus } from "tabler-icons-react";

type NewsResponse = News[] | { news: News[] };

export interface TableProps {
  newses: NewsResponse;
}

export const NewsTable: React.FC<TableProps> = ({ newses }) => {
  const navigate = useNavigate();
  // Ensure newses is an array
  const newsArray = Array.isArray(newses)
    ? newses
    : (newses as { news: News[] })?.news || [];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Text className="table-title" size="xl" weight={600}>
          News Management
        </Text>

        <Button
          onClick={() => navigate("/admin/news/add")}
          className="action-button"
        >
          <CirclePlus size={20} strokeWidth={2} color={"white"} />
          Add News
        </Button>
      </div>

      {newsArray.length > 0 ? (
        <Table
          data-testid="news-table"
          highlightOnHover
          verticalSpacing="md"
          horizontalSpacing="lg"
          className="custom-table"
        >
          <thead className="table-header">
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {newsArray.map((news, index) => (
              <tr key={index} className="table-row">
                <td>
                  <Text weight={500} lineClamp={1}>
                    {news.title}
                  </Text>
                </td>
                <td>
                  <Badge color="indigo" variant="light" radius="sm">
                    {news.category.name}
                  </Badge>
                </td>
                <td>
                  <span
                    className={`badge ${
                      news.is_featured ? "badge-featured" : "badge-inactive"
                    }`}
                  >
                    {news.is_featured ? "Featured" : "Standard"}
                  </span>
                </td>
                <td>
                  <Button
                    component={Link}
                    to={`/admin/news/details/${news.id}`}
                    className="action-button"
                    variant="filled"
                    compact
                    radius="md"
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📰</div>
          <Text className="empty-state-text">No news articles found</Text>
        </div>
      )}
    </>
  );
};
