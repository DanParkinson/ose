import { useCallback, useEffect, useState } from "react";

import { fetchCoreModelList } from "../api/coreApi";

const useCoreModelData = (
  endpoint,
  offset,
  searchQuery,
  activeFilters
) => {
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRows = useCallback(async () => {
    if (!endpoint) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchCoreModelList({
        endpoint,
        limit: 20,
        offset,
        searchQuery,
        filters: activeFilters,
      });

      setRows(data.results || data);
      setCount(data.count || 0);
      setNext(data.next || null);
      setPrevious(data.previous || null);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, offset, searchQuery, activeFilters]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  return {
    rows,
    count,
    next,
    previous,
    loading,
    error,
    refetch: fetchRows,
  };
};

export default useCoreModelData;
