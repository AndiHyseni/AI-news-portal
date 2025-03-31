import { Container } from "@mantine/core";
import { useState } from "react";
import { Sidebar } from "../../components/Administration/Sidebar";
import { BasePage } from "../../components/BasePage/BasePage";
import { CreateCategoriesModal } from "../../components/Modals/CreateCategoriesModal";
import { DeleteCategoriesModal } from "../../components/Modals/DeleteCategoriesModal";
import { EditCategoriesModal } from "../../components/Modals/EditCategoriesModal";
import { CategoriesTable } from "../../components/Tables/CategoriesTable";
import { useCategories } from "../../hooks/useCategories/useCategories";
import { useCreateCategories } from "../../hooks/useCategories/useCreateCategories";
import { useDeleteCategories } from "../../hooks/useCategories/useDeleteCategories";
import { Categories } from "../../types/categories/categories";
import "../AdminCategories/AdminCategories.css";

export const AdminCategories: React.FC = () => {
  const { data } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState<Categories>();
  const [isDeleteCategoriesModalOpen, setIsDeleteCategoriesModalOpen] =
    useState(false);
  const [createCategoriesModalOpen, setCreateCategoriesModalOpen] =
    useState(false);
  const [editCategoriesModalOpen, setEditCategoriesModalOpen] = useState(false);

  const deleteCategoriesMutation = useDeleteCategories();
  const editCategoriesMutation = useCreateCategories();

  const handleCreateCategories = (category: Categories) => {
    setSelectedCategory(category);
    setCreateCategoriesModalOpen(true);
  };
  const handleEditCategories = (category: Categories) => {
    setSelectedCategory(category);
    setEditCategoriesModalOpen(true);
  };
  const handleDeleteCategories = (category: Categories) => {
    setSelectedCategory(category);
    setIsDeleteCategoriesModalOpen(true);
  };
  return (
    <BasePage>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Container style={{ width: "100%" }}>
          <div className="adminCategoriesdiv">
            {data && (
              <CategoriesTable
                categories={data}
                onDeleteCategory={handleDeleteCategories}
                setIsOpenCreateModal={setCreateCategoriesModalOpen}
                onEditCategory={handleEditCategories}
              />
            )}
            <CreateCategoriesModal
              title="Create Categories Modal"
              onClose={() => setCreateCategoriesModalOpen(false)}
              opened={createCategoriesModalOpen}
            />
            {selectedCategory && (
              <>
                <EditCategoriesModal
                  categories={selectedCategory}
                  title="Edit Categories Modal"
                  onClose={() => setEditCategoriesModalOpen(false)}
                  opened={editCategoriesModalOpen}
                  mutation={editCategoriesMutation}
                />
                <DeleteCategoriesModal
                  category={selectedCategory}
                  title="Delete Categories Modal"
                  text="Are you sure you want to delete this category?"
                  onClose={() => setIsDeleteCategoriesModalOpen(false)}
                  opened={isDeleteCategoriesModalOpen}
                  mutation={deleteCategoriesMutation}
                />
              </>
            )}
          </div>
        </Container>
      </div>
    </BasePage>
  );
};
