import {
  Button,
  Table,
  Text,
  Badge,
  Group,
  Pagination,
  Select,
  Box,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { News } from "../../types/news/news";
import "./Tables.css";
import { CirclePlus, Robot, News as NewsIcon, Tags } from "tabler-icons-react";
import { useGenerateSummaries } from "../../hooks/useNews/useGenerateSummaries";
import { useGenerateSummariesWithNewsAPI } from "../../hooks/useNews/useNewsAPI";
import {
  useGenerateSummariesWithNLP,
  useGenerateTagsWithNLP,
} from "../../hooks/useNews/useNLP";
import { useState, useEffect } from "react";
import { GenerateSummariesModal } from "../Modals/GenerateSummariesModal";
import { ImportNewsModal } from "../Modals/ImportNewsModal";
import { GenerateTagsModal } from "../Modals/GenerateTagsModal";
import { toast } from "react-toastify";

type NewsResponse = News[] | { news: News[] };

export interface TableProps {
  newses: NewsResponse;
}

export const NewsTable: React.FC<TableProps> = ({ newses }) => {
  const navigate = useNavigate();
  const generateSummariesMutation = useGenerateSummaries();
  const generateSummariesNewsAPIMutation = useGenerateSummariesWithNewsAPI();
  const generateSummariesNLPMutation = useGenerateSummariesWithNLP();
  const generateTagsNLPMutation = useGenerateTagsWithNLP();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset to first page when itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Set up notification handlers with useEffect
  useEffect(() => {
    if (generateSummariesMutation.isSuccess) {
      toast.success("Summaries generated successfully with OpenAI", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    if (generateSummariesMutation.isError) {
      toast.error("Failed to generate summaries with OpenAI", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [generateSummariesMutation.isSuccess, generateSummariesMutation.isError]);

  // NewsAPI notifications
  useEffect(() => {
    if (generateSummariesNewsAPIMutation.isSuccess) {
      toast.success("Summaries generated successfully with NewsAPI", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    if (generateSummariesNewsAPIMutation.isError) {
      toast.error("Failed to generate summaries with NewsAPI", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [
    generateSummariesNewsAPIMutation.isSuccess,
    generateSummariesNewsAPIMutation.isError,
  ]);

  // NLP summary notifications
  useEffect(() => {
    if (generateSummariesNLPMutation.isSuccess) {
      toast.success("Summaries generated successfully with NLP", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    if (generateSummariesNLPMutation.isError) {
      toast.error("Failed to generate summaries with NLP", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [
    generateSummariesNLPMutation.isSuccess,
    generateSummariesNLPMutation.isError,
  ]);

  // NLP tag notifications
  useEffect(() => {
    if (generateTagsNLPMutation.isSuccess) {
      toast.success("Tags generated successfully with NLP", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    if (generateTagsNLPMutation.isError) {
      toast.error("Failed to generate tags with NLP", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [generateTagsNLPMutation.isSuccess, generateTagsNLPMutation.isError]);

  const [isSummariesModalOpen, setSummariesModalOpen] = useState(false);
  const [isTagsModalOpen, setTagsModalOpen] = useState(false);
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [useNewsAPI, setUseNewsAPI] = useState(false);
  const [useNLP, setUseNLP] = useState(false);

  // Ensure newses is an array
  const newsArray = Array.isArray(newses)
    ? newses
    : (newses as { news: News[] })?.news || [];

  // Calculate pagination
  const totalItems = newsArray.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = newsArray.slice(startIndex, startIndex + itemsPerPage);

  const handleGenerateSummaries = (
    useNewsAPIParam: boolean,
    useNLPParam: boolean
  ) => {
    setUseNewsAPI(useNewsAPIParam);
    setUseNLP(useNLPParam);
    setSummariesModalOpen(true);
  };

  const handleGenerateTags = () => {
    setTagsModalOpen(true);
  };

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

        <Group spacing="md">
          {/* <Button
            onClick={() => handleGenerateSummaries(false, false)}
            className="action-button"
            color="teal"
          >
            <Robot
              size={20}
              strokeWidth={2}
              color={"white"}
              style={{ marginRight: "8px" }}
            />
            Generate Summaries (OpenAI)
          </Button> */}

          {/* <Button
            onClick={() => handleGenerateSummaries(true, false)}
            className="action-button"
            color="cyan"
          >
            <Robot
              size={20}
              strokeWidth={2}
              color={"white"}
              style={{ marginRight: "8px" }}
            />
            Generate Summaries (NewsAPI)
          </Button> */}

          <Button
            onClick={() => handleGenerateSummaries(false, true)}
            className="action-button"
            color="violet"
          >
            <Robot
              size={20}
              strokeWidth={2}
              color={"white"}
              style={{ marginRight: "8px" }}
            />
            Generate Summaries (NLP)
          </Button>

          <Button
            onClick={handleGenerateTags}
            className="action-button"
            color="grape"
          >
            <Tags
              size={20}
              strokeWidth={2}
              color={"white"}
              style={{ marginRight: "8px" }}
            />
            Generate Tags (NLP)
          </Button>

          <Button
            onClick={() => setImportModalOpen(true)}
            className="action-button"
            color="indigo"
          >
            <NewsIcon
              size={20}
              strokeWidth={2}
              color={"white"}
              style={{ marginRight: "8px" }}
            />
            Import from NewsAPI
          </Button>

          <Button
            onClick={() => navigate("/admin/news/add")}
            className="action-button"
          >
            <CirclePlus
              size={20}
              strokeWidth={2}
              color={"white"}
              style={{ marginRight: "8px" }}
            />
            Add News
          </Button>
        </Group>
      </div>

      {/* Summary generation confirmation modal */}
      <GenerateSummariesModal
        opened={isSummariesModalOpen}
        onClose={() => setSummariesModalOpen(false)}
        mutation={
          useNLP
            ? generateSummariesNLPMutation
            : useNewsAPI
            ? generateSummariesNewsAPIMutation
            : generateSummariesMutation
        }
        apiSource={useNLP ? "NLP" : useNewsAPI ? "NewsAPI" : "OpenAI"}
      />

      {/* Tags generation confirmation modal */}
      <GenerateTagsModal
        opened={isTagsModalOpen}
        onClose={() => setTagsModalOpen(false)}
        mutation={generateTagsNLPMutation}
        model="NLP"
      />

      {/* Import news modal */}
      <ImportNewsModal
        opened={isImportModalOpen}
        onClose={() => setImportModalOpen(false)}
      />

      {newsArray.length > 0 ? (
        <>
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
              {paginatedNews.map((news, index) => (
                <tr key={index} className="table-row">
                  <td>
                    <Text weight={500} lineClamp={1}>
                      {news.title}
                    </Text>
                  </td>
                  <td>
                    <Badge color="indigo" variant="light" radius="sm">
                      {news.category?.name || "Unknown"}
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
                {totalItems} news articles
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
          <div className="empty-state-icon">📰</div>
          <Text className="empty-state-text">No news articles found</Text>
        </div>
      )}
    </>
  );
};
