import { useQuery } from "@tanstack/react-query";
import { getReactions } from "../../api/administration/administration";

export const useReactions = () => {
  return useQuery(["useReactions"], () => getReactions());
};
