import {
  Table,
  Text,
  Badge,
  Group,
  Pagination,
  Select,
  Box,
} from "@mantine/core";
import { ViewsDetails } from "../../types/administration/administration";
import "./ViewsDetailsTable.css";
import { useState, useMemo } from "react";

export interface TableProps {
  viewsDetails: ViewsDetails[];
}

export const ViewsDetailsTable: React.FC<TableProps> = ({ viewsDetails }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate pagination values
  const totalItems = viewsDetails.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Get current page data
  const paginatedViews = useMemo(
    () => viewsDetails.slice(startIndex, startIndex + itemsPerPage),
    [viewsDetails, startIndex, itemsPerPage]
  );

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
    <>
      <Text className="table-title" size="xl" weight={600} mb="md">
        View History
      </Text>

      {viewsDetails.length > 0 ? (
        <>
          <Table
            data-testid="viewsDetails-table"
            highlightOnHover
            verticalSpacing="md"
            horizontalSpacing="lg"
            className="views-table"
          >
            <thead className="table-header">
              <tr>
                <th>News ID</th>
                <th>User</th>
                {/* <th>Fingerprint ID</th> */}
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {paginatedViews.map((view, index) => (
                <tr key={index} className="table-row">
                  <td>
                    <Badge color="indigo" variant="filled" radius="sm">
                      {view.news_id}
                    </Badge>
                  </td>
                  <td>
                    {view.user_id ? (
                      <Badge color="green" variant="light">
                        {view.user_id}
                      </Badge>
                    ) : (
                      <Badge color="gray" variant="outline">
                        Anonymous
                      </Badge>
                    )}
                  </td>
                  {/* <td>
                    <Text size="sm" color="dimmed">
                      {view.finger_print_id || "Not available"}
                    </Text>
                  </td> */}
                  <td>
                    <Text size="sm" className="timestamp">
                      {formatDate(view.watched_on)}
                    </Text>
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
                {totalItems} views
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
        <tr>
          <td colSpan={4}>
            <Text align="center" color="dimmed" my="lg">
              No view data available
            </Text>
          </td>
        </tr>
      )}
    </>
  );
};
