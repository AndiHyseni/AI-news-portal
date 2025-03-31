import { useQuery } from "@tanstack/react-query";
import { getNewsConfig } from "../../api/administration/administration";

export const useConfiguration = () => {
  return useQuery(["useConfiguration"], () => getNewsConfig());
};
