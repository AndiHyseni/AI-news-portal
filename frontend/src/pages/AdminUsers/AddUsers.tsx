import { Container } from "@mantine/core";
import { AddUsers } from "../../components/AddUsers/AddUsers";
import { Sidebar } from "../../components/Administration/Sidebar";
import { BasePage } from "../../components/BasePage/BasePage";

export const AddUsersPage: React.FC = () => {
  return (
    <BasePage>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Container style={{ width: "100%" }}>
          <AddUsers />
        </Container>
      </div>
    </BasePage>
  );
};
