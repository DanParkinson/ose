import { chakra, Input } from "@chakra-ui/react";

const AppInput = chakra(Input, {
  base: {
    bg: "bg.light1",
    color: "text.dark1",
    border: "1px solid",
    borderColor: "border.light3",
    borderRadius: "md",

    _placeholder: {
      color: "text.dark5",
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
          borderColor: "bg.primarydark",
        },

        _focusVisible: {
          borderColor: "bg.primarydark",
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
