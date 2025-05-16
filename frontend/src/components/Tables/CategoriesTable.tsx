import { ActionIcon, Text, Table, Paper, Button } from "@mantine/core";
import { CirclePlus, Edit, Trash } from "tabler-icons-react";
import "./Tables.css";
import { Categories } from "../../types/categories/categories";

export interface Props {
  categories: Categories[] | { categories: Categories[] };
  onDeleteCategory: (category: Categories) => void;
  onEditCategory: (category: Categories) => void;
  setIsOpenCreateModal: (isOpen: boolean) => void;
}

export const CategoriesTable: React.FC<Props> = ({
  categories,
  onDeleteCategory,
  onEditCategory,
  setIsOpenCreateModal,
}) => {
  // Ensure categories is an array
  const categoriesArray = Array.isArray(categories)
    ? categories
    : (categories as { categories: Categories[] }).categories || [];

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
          Categories Management
        </Text>

        <Button
          leftIcon={<CirclePlus size={20} />}
          onClick={() => setIsOpenCreateModal(true)}
          className="action-button"
        >
          Add Category
        </Button>
      </div>

      {categoriesArray && categoriesArray.length > 0 ? (
        <Table
          data-testid="category-table"
          highlightOnHover
          verticalSpacing="md"
          horizontalSpacing="lg"
          className="custom-table"
        >
          <thead className="table-header">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categoriesArray.map((category, index) => (
              <tr key={index} className="table-row">
                <td>
                  <Text weight={500}>{category.name}</Text>
                </td>
                <td>
                  <Text lineClamp={2} size="sm" color="dimmed">
                    {category.description}
                  </Text>
                </td>
                <td>
                  <span
                    className={`badge ${
                      category.show_online ? "badge-success" : "badge-inactive"
                    }`}
                  >
                    {category.show_online ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ width: "150px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <ActionIcon
                      color="blue"
                      onClick={() => onEditCategory(category)}
                      variant="light"
                      radius="md"
                      size="lg"
                    >
                      <Edit size={18} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      onClick={() => onDeleteCategory(category)}
                      variant="light"
                      radius="md"
                      size="lg"
                    >
                      <Trash size={18} />
                    </ActionIcon>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <Text className="empty-state-text">No categories found</Text>
        </div>
      )}
    </>
  );
};
