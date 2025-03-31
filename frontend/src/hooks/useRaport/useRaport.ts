import { useQuery } from "@tanstack/react-query";
import { getRapport } from "../../api/administration/administration";

export const useRapport = () => {
  return useQuery(["useRaport"], () => getRapport());
};
