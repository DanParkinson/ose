import { HStack, Text } from "@chakra-ui/react";

const DashboardTableTitleRow = ({
  title,
  actions,
}) => {
  return (
    <HStack justify="space-between" w="100%">
      <Text
        fontSize="sm"
        color="text.light1"
        fontWeight="medium"
      >
        {title}
      </Text>

      {actions}
    </HStack>
  );
};

export default DashboardTableTitleRow;
