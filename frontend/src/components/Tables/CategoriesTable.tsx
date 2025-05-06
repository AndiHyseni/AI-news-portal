import { Button, Table } from "@mantine/core";
import { CirclePlus, Edit, Trash } from "tabler-icons-react";
import { Categories } from "../../types/categories/categories";

type CategoriesResponse = Categories[] | { categories: Categories[] };

export interface TableProps {
  categories: CategoriesResponse;
  onDeleteCategory: (categories: Categories) => void;
  setIsOpenCreateModal: (isModalOpen: boolean) => void;
  onEditCategory: (categories: Categories) => void;
}

export const CategoriesTable: React.FC<TableProps> = ({
  categories,
  onDeleteCategory,
  setIsOpenCreateModal,
  onEditCategory,
}) => {
  // Ensure categories is an array
  const categoriesArray: Categories[] = Array.isArray(categories)
    ? categories
    : (categories as { categories: Categories[] }).categories || [];

  return (
    <>
      <Button className="addButton" onClick={() => setIsOpenCreateModal(true)}>
        <CirclePlus size={20} strokeWidth={2} color={"white"} />
        Add New Category
      </Button>
      <Table
        data-testid="categories-table"
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
            <th>Description</th>
            <th>Show Online</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {categoriesArray.map((category, index) => (
            <tr key={index}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>{category.show_online == true ? "Yes" : "No"}</td>
              <td>
                <Button onClick={() => onEditCategory(category)}>
                  <Edit size={20} strokeWidth={2} color={"white"} />
                </Button>
              </td>
              <td>
                <Button
                  color={"red"}
                  onClick={() => onDeleteCategory(category)}
                >
                  <Trash size={20} strokeWidth={2} color={"white"} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
