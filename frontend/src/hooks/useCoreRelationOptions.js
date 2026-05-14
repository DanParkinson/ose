import { useEffect, useState } from "react";

import { fetchCoreModelList } from "../api/coreApi";

const useCoreRelationOptions = (fields) => {
  const [relationOptions, setRelationOptions] = useState({});

  useEffect(() => {
    const fetchRelations = async () => {
      const relationFields = fields.filter(
        (field) => field.type === "relation"
      );

      const loadedRelations = {};

      for (const field of relationFields) {
        try {
          const data = await fetchCoreModelList({
            endpoint: field.endpoint,
            limit: 100,
            offset: 0,
          });

          loadedRelations[field.name] = data.results || data;
        } catch (error) {
          console.error(error);
          loadedRelations[field.name] = [];
        }
      }

      setRelationOptions(loadedRelations);
    };

    fetchRelations();
  }, [fields]);

  return relationOptions;
};

export default useCoreRelationOptions;
