import { Center, Spinner } from "@chakra-ui/react";

const LoadingSpinner = ({ label = "Loading..." }) => {
  return (
    <Center
      w="100%"
      h="100%"
      minH="120px"
      color="text.light4"
    >
      <Spinner
        size="lg"
        borderWidth="3px"
        color="text.primarylight"
        aria-label={label}
      />
    </Center>
  );
};

export default LoadingSpinner;
