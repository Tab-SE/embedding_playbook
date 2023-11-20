import { useQuery, } from "@tanstack/react-query"
import { useState, useEffect } from "react";
// implements custom hooks with tanstack query for asynchronous state management of Tableau
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v3/docs/react/guides/dependent-queries

export const useInsights = async () => {

  const getInsights = async () => {

  }

  return useQuery({
    queryKey: ['tableau', 'pulse', 'insights', id],
    queryFn: async () => await getInsights(),
    enabled: active,
  });
};
