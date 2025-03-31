import { Button, Container } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { CirclePlus } from "tabler-icons-react";
import { Sidebar } from "../../components/Administration/Sidebar";
import { BasePage } from "../../components/BasePage/BasePage";
import { NewsTable } from "../../components/Tables/NewsTable";
import { useNews } from "../../hooks/useNews/useNews";
import "../AdminNews/AdminNews.css";

export const AdminNews: React.FC = () => {
  const { data } = useNews();
  const navigate = useNavigate();
  return (
    <BasePage>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Container style={{ width: "100%" }}>
          <div className="adminNewsdiv">
            <Button className="addButton" onClick={() => navigate("/news/add")}>
              <CirclePlus size={20} strokeWidth={2} color={"white"} />
              Add News
            </Button>
            {data && <NewsTable newses={data} />}
          </div>
        </Container>
      </div>
    </BasePage>
  );
};
