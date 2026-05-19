import {
  Box,
  Text,
} from "@chakra-ui/react";

import AppLink from "../ui/AppLink";

const SubjectCard = ({ subject }) => {
  return (
    <AppLink
      to={`/subjects/${subject.slug}/${subject.subject_id}/`}
      display="block"
    >
      <Box
        position="relative"
        px="4"
        py="3"
        minH="46px"
        border="1px solid"
        borderColor="border.dark1"
        borderRadius="md"
        bg="bg.dark2"
        display="flex"
        alignItems="center"
        overflow="hidden"
        transition="0.2s ease"
        cursor="pointer"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          w: "3px",
          h: "100%",
          bg: "bg.primarylight",
          opacity: 0,
          transition: "0.2s ease",
        }}
        _hover={{
          borderColor: "border.dark3",
          bg: "bg.dark3",

          "&::before": {
            opacity: 1,
          },
        }}
      >
        <Text
          color="text.light4"
          fontSize="sm"
          fontWeight="medium"
        >
          {subject.title}
        </Text>
      </Box>
    </AppLink>
  );
};

export default SubjectCard;
