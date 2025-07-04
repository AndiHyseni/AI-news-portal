import {
  Table,
  Text,
  Badge,
  Button,
  Group,
  Pagination,
  Select,
  Box,
} from "@mantine/core";
import { Views } from "../../types/administration/administration";
import { Link } from "react-router-dom";
import { ChartBar } from "tabler-icons-react";
import "./Tables.css";
import { useState, useMemo } from "react";

interface ViewsResponse {
  statusCode: string;
  statusIsOk: boolean;
  statusMessage: string;
  statusPath: string;
  statusDate: string;
  views: any[];
}

export interface TableProps {
  views: ViewsResponse | Views[] | any[];
}

export const ViewsTable: React.FC<TableProps> = ({ views }) => {
  // Extract views array from response if needed
  const unsortedViewsArray = Array.isArray(views)
    ? views
    : (views as ViewsResponse).views || [];

  // Sort views by number of clicks in descending order
  const viewsArray = [...unsortedViewsArray].sort(
    (a, b) => b.nrOfClicks - a.nrOfClicks
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate pagination values
  const totalItems = viewsArray.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Get current page data
  const paginatedViews = useMemo(
    () => viewsArray.slice(startIndex, startIndex + itemsPerPage),
    [viewsArray, startIndex, itemsPerPage]
  );

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
          Views Statistics{" "}
          <span
            style={{ fontSize: "14px", fontWeight: "normal", color: "#666" }}
          >
            (sorted by popularity)
          </span>
        </Text>
      </div>

      {viewsArray.length > 0 ? (
        <>
          <Table
            data-testid="views-table"
            highlightOnHover
            verticalSpacing="md"
            horizontalSpacing="lg"
            className="custom-table"
          >
            <thead className="table-header">
              <tr>
                <th>Article Title</th>
                <th>Article ID</th>
                <th>Total Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedViews.map((view, index) => (
                <tr key={index} className="table-row">
                  <td>
                    <Text weight={500} lineClamp={1}>
                      {view.NewsTitle || view.newsTitle || "Untitled"}
                    </Text>
                  </td>
                  <td>
                    {view.id ? (
                      <Badge color="indigo" variant="light" radius="sm">
                        {view.id}
                      </Badge>
                    ) : (
                      <Badge color="gray" variant="outline" radius="sm">
                        No ID
                      </Badge>
                    )}
                  </td>
                  <td>
                    <Text
                      weight={600}
                      size="lg"
                      color="#26145c"
                      sx={{
                        display: "inline-block",
                        background: "rgba(38, 20, 92, 0.1)",
                        padding: "4px 12px",
                        borderRadius: "20px",
                      }}
                    >
                      {view.nrOfClicks}
                    </Text>
                  </td>
                  <td>
                    {view.id && (
                      <Button
                        component={Link}
                        to={`/admin/views/${view.id}`}
                        className="action-button"
                        variant="filled"
                        leftIcon={<ChartBar size={16} />}
                        compact
                        radius="md"
                      >
                        View Details
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination controls */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <Group>
              <Text size="sm">Items per page:</Text>
              <Select
                value={itemsPerPage.toString()}
                onChange={(value) => setItemsPerPage(Number(value))}
                data={[
                  { value: "5", label: "5" },
                  { value: "10", label: "10" },
                  { value: "25", label: "25" },
                  { value: "50", label: "50" },
                ]}
                style={{ width: 80 }}
              />
              <Text size="sm">
                Showing {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, totalItems)} of{" "}
                {totalItems} articles
              </Text>
            </Group>
            <Pagination
              total={totalPages}
              page={currentPage}
              onChange={setCurrentPage}
              withEdges
            />
          </Box>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">👁️</div>
          <Text className="empty-state-text">No view data available</Text>
        </div>
      )}
    </>
  );
};
