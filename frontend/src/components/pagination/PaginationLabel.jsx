import { Text, VStack } from "@chakra-ui/react";

const PaginationLabel = ({
  offset,
  limit,
  count,
}) => {
  const currentPage =
    Math.floor(offset / limit) + 1;

  const totalPages = Math.max(
    Math.ceil(count / limit),
    1
  );

  return (
    <VStack gap={0}>
      <Text
        fontSize="sm"
        color="text.light1"
        fontWeight="medium"
      >
        Page {currentPage} of {totalPages}
      </Text>

      <Text
        fontSize="xs"
        color="text.light4"
      >
        {count} results
      </Text>
    </VStack>
  );
};

export default PaginationLabel;
