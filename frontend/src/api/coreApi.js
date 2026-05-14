import { axiosResponse } from "./axiosDefaults";

export const fetchCoreModelList = async ({
  endpoint,
  limit = 20,
  offset = 0,
  searchQuery = "",
  filters = {},
}) => {
  const params = {
    limit,
    offset,
    search: searchQuery || undefined,
  };

  // filtering by all is ignored and returns full response
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "all") {
      params[key] = value;
    }
  });

  const response = await axiosResponse.get(endpoint, {
    params,
  });

  return response.data;
};

// Fetches metadata about a model endpoint using the HTTP OPTIONS method
export const fetchCoreModelOptions = async ({ endpoint }) => {
  const response = await axiosResponse.options(endpoint);
  return response.data;
};

export const createCoreModelItem = async ({
  endpoint,
  data,
}) => {
  const response = await axiosResponse.post(endpoint, data);
  return response.data;
};
