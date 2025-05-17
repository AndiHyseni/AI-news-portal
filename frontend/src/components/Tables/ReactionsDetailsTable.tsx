import { Table, Text } from "@mantine/core";
import { ReactionsDetails } from "../../types/administration/administration";

export interface TableProps {
  reactionsDetails: ReactionsDetails[] | { reactions: ReactionsDetails[] };
}

export const ReactionsDetailsTable: React.FC<TableProps> = ({
  reactionsDetails,
}) => {
  const detailsArray = Array.isArray(reactionsDetails)
    ? reactionsDetails
    : reactionsDetails.reactions || [];

  // Get the news title from the first reaction (they're all for the same news)
  const newsTitle = detailsArray[0]?.news?.title || detailsArray[0]?.news_id;

  return (
    <>
      <Text
        size="xl"
        weight={600}
        mb="md"
        style={{ textAlign: "center", color: "#26145c" }}
      >
        Reactions for article: {newsTitle}
      </Text>

      <Table
        data-testid="reactionsDetails-table"
        highlightOnHover
        verticalSpacing={6}
        style={{ marginTop: 5, marginBottom: 20, textAlign: "center" }}
        sx={() => ({
          backgroundColor: "white",
          boxShadow: "4px 4px 20px rgba(0, 0, 0, 0.15)",
          borderRadius: "8px",
          overflow: "hidden",
        })}
      >
        <thead>
          <tr style={{ backgroundColor: "#f8f9fa" }}>
            <th style={{ padding: "12px 16px", textAlign: "center" }}>User</th>
            <th style={{ padding: "12px 16px", textAlign: "center" }}>
              Reaction
            </th>
          </tr>
        </thead>
        <tbody>
          {detailsArray.map((detail, index) => (
            <tr key={index}>
              <td style={{ padding: "12px 16px" }}>
                {detail.user?.name || detail.user_id}
              </td>
              <td style={{ padding: "12px 16px", fontSize: "20px" }}>
                {detail.reaction === 1 && "😊"}
                {detail.reaction === 2 && "😔"}
                {detail.reaction === 3 && "😠"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
