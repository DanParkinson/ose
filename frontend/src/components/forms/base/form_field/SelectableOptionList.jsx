import { Text, VStack } from "@chakra-ui/react";

const SelectableOptionList = ({
  options,
  field,
  selectedValues,
  onSelect,
  formatOption,
}) => {
  if (!options.length) return null;

  return (
    <VStack
      align="stretch"
      gap={1}
      border="1px solid"
      borderColor="border.dark2"
      borderRadius="md"
      p={1}
      maxH="200px"
      overflowY="auto"
    >
      {options.map((option) => {
        const optionId = option[field.optionValue];

        const isSelected = field.multiple
          ? selectedValues.includes(optionId)
          : selectedValues === optionId;

        return (
          <Text
            key={optionId}
            fontSize="sm"
            px={3}
            py={2}
            borderRadius="md"
            bg={isSelected ? "bg.dark3" : "transparent"}
            color={isSelected ? "text.primarylight" : "text.light4"}
            cursor="pointer"
            _hover={{ bg: "bg.dark3" }}
            onClick={() => onSelect(option)}
          >
            {formatOption(option)}
          </Text>
        );
      })}
    </VStack>
  );
};

export default SelectableOptionList;
