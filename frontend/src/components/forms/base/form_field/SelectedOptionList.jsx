import { HStack, Text, VStack } from "@chakra-ui/react";

import DeleteIconButton from "../../../buttons/DeleteIconButton";

const SelectedOptionList = ({
  title,
  options,
  optionValue,
  onRemove,
  formatOption,
}) => {
  if (!options.length) return null;

  return (
    <VStack align="stretch" gap={2} mt={2}>
      <Text fontSize="xs" color="text.light4" fontWeight="bold">
        {title}
      </Text>

      {options.map((option) => (
        <HStack
          key={option[optionValue]}
          justify="space-between"
          border="1px solid"
          borderColor="border.dark2"
          borderRadius="md"
          px={3}
          py={2}
        >
          <Text fontSize="sm" color="text.light1">
            {formatOption(option)}
          </Text>

          <DeleteIconButton onClick={() => onRemove(option)} />
        </HStack>
      ))}
    </VStack>
  );
};

export default SelectedOptionList;
