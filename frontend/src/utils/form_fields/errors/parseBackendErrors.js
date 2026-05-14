const parseBackendErrors = (error) => {
  const backendErrors = error.response?.data;

  if (!backendErrors || typeof backendErrors !== "object") {
    return {
      fieldErrors: {},
      generalError: "Could not create item. Please check the form.",
    };
  }

  const { non_field_errors, detail, ...fieldErrors } = backendErrors;

  let generalError = "";

  if (non_field_errors) {
    generalError = Array.isArray(non_field_errors)
      ? non_field_errors.join(" ")
      : non_field_errors;
  } else if (detail) {
    generalError = detail;
  }

  return {
    fieldErrors,
    generalError,
  };
};

export default parseBackendErrors;
