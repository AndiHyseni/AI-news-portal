import { StatusCodeEnums } from "../../interfaces/enums";
import { failure, ok } from "../../utils";
import CategoriesDbModel from "../../models/Category.model";

export const CategoriesService = {
  getAllCategories: async () => {
    try {
      const categories = await CategoriesDbModel.query().orderBy("name", "ASC");
      return ok({ categories });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  getAllCategoriesOnline: async () => {
    try {
      const categories = await CategoriesDbModel.query().orderBy("name", "ASC");
      // Filter categories where ShowOnline is true
      const onlineCategories = categories.filter(
        (cat: any) => cat.ShowOnline === true
      );
      return ok({ categories: onlineCategories });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  getCategoryById: async (id: string) => {
    try {
      const category = await CategoriesDbModel.query().findById(id);
      if (!category) {
        return failure(
          { error: "Category not found" },
          StatusCodeEnums.UNEXPECTED
        );
      }
      return ok({ category });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  addCategory: async (
    name: string,
    description: string,
    show_online: boolean
  ) => {
    try {
      const category = await CategoriesDbModel.query().insert({
        name,
        description,
        show_online,
      });
      return ok({ category });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  updateCategory: async (
    id: string,
    name: string,
    description: string,
    show_online: boolean
  ) => {
    try {
      const category = await CategoriesDbModel.query().findById(id);
      if (!category) {
        return failure(
          { error: "Category not found" },
          StatusCodeEnums.UNEXPECTED
        );
      }

      const updatedCategory = await CategoriesDbModel.query().patchAndFetchById(
        id,
        {
          name,
          description,
          show_online,
        }
      );

      return ok({ category: updatedCategory });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  deleteCategory: async (id: string) => {
    try {
      const category = await CategoriesDbModel.query().findById(id);
      if (!category) {
        return failure(
          { error: "Category not found" },
          StatusCodeEnums.UNEXPECTED
        );
      }
      await CategoriesDbModel.query().deleteById(id);
      return ok({ message: "Category deleted successfully" });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
};
