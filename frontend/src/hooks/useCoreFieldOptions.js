import { useEffect, useState } from "react";

import { fetchCoreModelOptions } from "../api/coreApi";

const useCoreFieldOptions = (endpoint) => {
  const [fieldOptions, setFieldOptions] = useState({});

  useEffect(() => {
    const fetchOptions = async () => {
      if (!endpoint) return;

      try {
        const data = await fetchCoreModelOptions({
          endpoint,
        });

        setFieldOptions(data.actions?.POST || {});
      } catch (error) {
        console.error(error);
        setFieldOptions({});
      }
    };

    fetchOptions();
  }, [endpoint]);

  return fieldOptions;
};

export default useCoreFieldOptions;
