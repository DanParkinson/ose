import { Box, Text } from "@chakra-ui/react";
import { HiCheck, HiX } from "react-icons/hi";

const ModelFieldRenderer = ({ value, emptyValue = "-" }) => {
  if (typeof value === "boolean") {
    return (
      <Box color={value ? "green.400" : "red.400"}>
        {value ? <HiCheck size={22} /> : <HiX size={22} />}
      </Box>
    );
  }

  if (Array.isArray(value)) {
    return (
      <Text fontSize="sm" color="text.light4">
        {value
          .map((item) => {
            if (typeof item === "object" && item !== null) {
              return [item.title, item.level, item.language]
                .filter(Boolean)
                .join(" - ");
            }

            return item;
          })
          .join(", ")}
      </Text>
    );
  }

  return (
    <Text fontSize="sm" color="text.light4">
      {value == null || value === "" ? emptyValue : String(value)}
    </Text>
  );
};

export default ModelFieldRenderer;
