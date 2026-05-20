import { Box, Input } from "@chakra-ui/react";
import { useEffect } from "react";

const TextSearchFilter = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  delay = 1000,
}) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, onSearch, delay]);

  return (
    <Box
      w="100%"
      mt="2"
      border="2px solid"
      borderColor="border.dark1"
      borderRadius="xl"
      bg="bg.light3"
      transition="all 0.2s ease"
      _focusWithin={{
        borderColor: "text.primarylight",
        boxShadow:
          "0 0 0 1px var(--chakra-colors-text-primarylight)",
      }}
    >
      <Input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        color="text.dark1"
        border="none"
        bg="transparent"
        _placeholder={{
          color: "text.dark4",
        }}
        _focusVisible={{
          outline: "none",
          boxShadow: "none",
        }}
      />
    </Box>
  );
};

export default TextSearchFilter;
