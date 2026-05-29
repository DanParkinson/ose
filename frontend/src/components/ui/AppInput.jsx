import { chakra, Input } from "@chakra-ui/react";

const AppInput = chakra(Input, {
  base: {
    bg: "bg.dark3",
    color: "text.light2",
    border: "1px solid",
    borderColor: "border.dark3",
    borderRadius: "md",

    _placeholder: {
      color: "text.light2",
    },

    _hover: {
      borderColor: "bg.primarydark",
    },

    _focusVisible: {
      borderColor: "bg.primarydark",
      boxShadow: "0 0 0 1px var(--chakra-colors-bg-primarydark)",
      outline: "none",
    },

    _active: {
      borderColor: "bg.primarydark",
    },
  },

  variants: {
    variant: {
      primary: {},

      subtle: {
        bg: "bg.light2",
        borderColor: "transparent",

        _hover: {
          borderColor: "bg.primarylight",
        },

        _focusVisible: {
          borderColor: "bg.light1     ",
          boxShadow: "0 0 0 1px var(--chakra-colors-bg-primarydark)",
        },
      },
    },
  },

  defaultVariants: {
    variant: "primary",
  },
});

export default AppInput;
