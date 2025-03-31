import { useQuery } from "@tanstack/react-query";
import { getViews } from "../../api/administration/administration";

export const useViews = () => {
  return useQuery(["useViews"], () => getViews());
};
