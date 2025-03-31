import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../api/categories/categories";

export const useCategories = () => {
  return useQuery(["useCategories"], () => getCategories());
};
