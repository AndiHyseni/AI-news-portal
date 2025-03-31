import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../api/administration/administration";

export const useUsers = () => {
  return useQuery(["useUsers"], () => getUsers());
};
