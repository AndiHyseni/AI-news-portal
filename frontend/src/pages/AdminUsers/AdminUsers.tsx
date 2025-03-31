import { Button, Container } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CirclePlus } from "tabler-icons-react";
import { Sidebar } from "../../components/Administration/Sidebar";
import { BasePage } from "../../components/BasePage/BasePage";
import { DeleteUsersModal } from "../../components/Modals/DeleteUsersModal";
import { EditUsersModal } from "../../components/Modals/EditUsersModal";
import { UsersTable } from "../../components/Tables/UsersTable";
import { useDeleteUsers } from "../../hooks/useUsers/useDeleteUsers";
import { useEditUser } from "../../hooks/useUsers/useEditUser";
import { useUsers } from "../../hooks/useUsers/useUsers";
import { Users } from "../../types/administration/administration";
import "../AdminUsers/AdminUsers.css";

export const AdminUsers: React.FC = () => {
  const { data } = useUsers();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<Users>();
  const [editCategoriesModalOpen, setEditUsersModalOpen] = useState(false);
  const [isDeleteUsersModalOpen, setIsDeleteUsersModalOpen] = useState(false);
  const deleteUsersMutation = useDeleteUsers();
  const editUserMutation = useEditUser();
  const handleEditUsers = (users: Users) => {
    setSelectedUser(users);
    setEditUsersModalOpen(true);
  };
  const handleDeleteUsers = (users: Users) => {
    setSelectedUser(users);
    setIsDeleteUsersModalOpen(true);
  };
  return (
    <BasePage>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Container style={{ width: "100%" }}>
          <div className="adminUsersdiv">
            <Button className="addButton" onClick={() => navigate("/addAdmin")}>
              <CirclePlus size={20} strokeWidth={2} color={"white"} />
              Add Users
            </Button>
            {data && (
              <UsersTable
                users={data}
                onDeleteUsers={handleDeleteUsers}
                onEditUser={handleEditUsers}
              />
            )}
            {selectedUser && (
              <>
                <EditUsersModal
                  user={selectedUser}
                  title="Edit Users Modal"
                  onClose={() => setEditUsersModalOpen(false)}
                  opened={editCategoriesModalOpen}
                  mutation={editUserMutation}
                />
                <DeleteUsersModal
                  users={selectedUser}
                  title="Delete Users Modal"
                  text="Are you sure you want to delete this user?"
                  onClose={() => setIsDeleteUsersModalOpen(false)}
                  opened={isDeleteUsersModalOpen}
                  mutation={deleteUsersMutation}
                />
              </>
            )}
          </div>
        </Container>
      </div>
    </BasePage>
  );
};
