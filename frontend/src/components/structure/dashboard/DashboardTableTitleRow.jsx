import { Button, Flex } from "@chakra-ui/react";

const DashboardTableTitleRow = ({
  title,
  actions,
  onTitleClick,
}) => {
  return (
    <Flex align="center" justify="space-between" w="100%" gap={3}>
      <Button
        variant="dashboardTitleRow"
        flex="1"
        onClick={onTitleClick}
        px={3}
        py={3}
      >
        {title}
      </Button>

      {actions}
    </Flex>
  );
};

export default DashboardTableTitleRow;
