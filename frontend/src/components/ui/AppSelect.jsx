import { chakra } from "@chakra-ui/react";

const AppSelect = chakra("select", {
  base: {
    bg: "bg.light2",
    color: "text.dark3",
    border: "1px solid",
    borderColor: "border.dark2",
    borderRadius: "md",
    px: 3,
    py: 2,
    minH: "40px",
    transition: "all 0.2s ease",

    _hover: {
      borderColor: "bg.dark3",
    },

    _focusVisible: {
      borderColor: "bg.primarydark",
      boxShadow: "0 0 0 1px var(--chakra-colors-bg-primarydark)",
      outline: "none",
    },

    _active: {
      borderColor: "bg.primarydark",
    },

    "& option": {
      background: "#1e1e1e",
      color: "white",
    },
  },

  variants: {
    variant: {
      primary: {},

      subtle: {
        bg: "bg.dark3",
        borderColor: "transparent",
      },
    },
  },

  defaultVariants: {
    variant: "primary",
  },
});

export default AppSelect;
