import { Container, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import { Sidebar } from "../../components/Administration/Sidebar";
import { BasePage } from "../../components/BasePage/BasePage";
import { ViewsTable } from "../../components/Tables/ViewsTable";
import { useViews } from "../../hooks/useViews/useViews";
import "../AdminViews/AdminViews.css";

export const AdminViews: React.FC = () => {
  const { data, isLoading, isError } = useViews();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isError) {
      setErrorMessage("Failed to load views data. Please try again later.");
    } else {
      setErrorMessage(null);
    }
  }, [isError]);

  return (
    <BasePage>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Container style={{ width: "100%" }}>
          <div className="adminViewsdiv">
            <h1>News Views Statistics</h1>
            {isLoading && <Text>Loading views data...</Text>}
            {errorMessage && <Text color="red">{errorMessage}</Text>}
            {data && !isLoading && !errorMessage && <ViewsTable views={data} />}
          </div>
        </Container>
      </div>
    </BasePage>
  );
};
