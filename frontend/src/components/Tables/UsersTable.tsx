import { Button, Table } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Edit, Trash } from "tabler-icons-react";
import { Users } from "../../types/administration/administration";

export interface TableProps {
  users: Users[];
  onDeleteUsers: (users: Users) => void;
  onEditUser: (users: Users) => void;
}

export const UsersTable: React.FC<TableProps> = ({
  users,
  onDeleteUsers,
  onEditUser,
}) => {
  const navigate = useNavigate();

  return (
    <Table
      data-testid="users-table"
      highlightOnHover
      verticalSpacing={6}
      style={{ marginTop: 5, marginBottom: 20, textAlign: "center" }}
      sx={() => ({
        backgroundColor: "white",
        boxShadow: "box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.15)",
      })}
    >
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index}>
            <td>{user.userId}</td>
            <td>{user.userName}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <Button onClick={() => onEditUser(user)}>
                <Edit size={20} strokeWidth={2} color={"white"} />
              </Button>
            </td>
            <td>
              <Button color={"red"} onClick={() => onDeleteUsers(user)}>
                <Trash size={20} strokeWidth={2} color={"white"} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
