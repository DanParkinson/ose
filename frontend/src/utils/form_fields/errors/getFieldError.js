const getFieldError = (fieldErrors, fieldName) => {
  const error = fieldErrors[fieldName];

  if (!error) return null;

  return Array.isArray(error) ? error.join(" ") : error;
};

export default getFieldError;
