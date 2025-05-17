import {
  ActionIcon,
  Paper,
  Table,
  Text,
  Badge,
  Avatar,
  Button,
} from "@mantine/core";
import { CirclePlus, UserCheck, UserX } from "tabler-icons-react";
import { Users } from "../../types/administration/administration";
import "./Tables.css";
import { useNavigate } from "react-router-dom";

type UsersResponse = Users[] | { users: Users[] };

export interface TableProps {
  users: UsersResponse;
  onDeleteUsers: (users: Users) => void;
  onEditUser: (users: Users) => void;
}

export const UsersTable: React.FC<TableProps> = ({
  users,
  onDeleteUsers,
  onEditUser,
}) => {
  const navigate = useNavigate();

  // Ensure users is an array
  const usersArray: Users[] = Array.isArray(users)
    ? users
    : (users as { users: Users[] }).users || [];

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
        <Text className="table-title" size="xl" weight={600} mb="md">
          User Management
        </Text>

        <Button
          leftIcon={<CirclePlus size={20} />}
          onClick={() => navigate("/admin/users/add")}
          className="action-button"
        >
          Add Users
        </Button>
      </div>

      {usersArray && usersArray.length > 0 ? (
        <Table
          data-testid="users-table"
          highlightOnHover
          verticalSpacing="md"
          horizontalSpacing="lg"
          className="custom-table"
        >
          <thead className="table-header">
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersArray.map((user, index) => (
              <tr key={index} className="table-row">
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <Avatar
                      radius="xl"
                      size="sm"
                      color={user.role === "Admin" ? "violet" : "blue"}
                    >
                      {user.name.substring(0, 2).toUpperCase()}
                    </Avatar>
                    <Text weight={500}>{user.name}</Text>
                  </div>
                </td>
                <td>
                  <Text size="sm">{user.email}</Text>
                </td>
                <td>
                  <Badge
                    color={user.role === "Admin" ? "violet" : "blue"}
                    variant="light"
                  >
                    {user.role}
                  </Badge>
                </td>
                <td>
                  {user.role === "Admin" ? (
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() => onDeleteUsers(user)}
                      radius="md"
                      size="lg"
                      title="Remove Admin"
                    >
                      <UserX size={18} />
                    </ActionIcon>
                  ) : (
                    <ActionIcon
                      color="green"
                      variant="light"
                      onClick={() => onEditUser(user)}
                      radius="md"
                      size="lg"
                      title="Make Admin"
                    >
                      <UserCheck size={18} />
                    </ActionIcon>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <Text className="empty-state-text">No users found</Text>
        </div>
      )}
    </>
  );
};
