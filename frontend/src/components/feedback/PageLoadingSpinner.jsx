import { Center, Spinner } from "@chakra-ui/react";

const PageLoadingSpinner = ({
  label = "Loading page...",
}) => {
  return (
    <Center
      minH="100vh"
      w="100%"
      color="text.light4"
    >
      <Spinner
        size="xl"
        borderWidth="4px"
        color="text.primarylight"
        aria-label={label}
      />
    </Center>
  );
};

export default PageLoadingSpinner;
