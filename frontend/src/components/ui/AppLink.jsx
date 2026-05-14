import { chakra } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const AppLink = chakra(NavLink, {
  base: {
    color: "text.light1",
    textDecoration: "none",

    _hover: {
      color: "hover",
      textDecoration: "none",
    },

    _focusVisible: {
      outline: "2px solid",
      outlineColor: "focusRing",
      outlineOffset: "2px",
      borderRadius: "sm",
    },
  },

  variants: {
    variant: {
      nav: {},

      brand: {
        textDecoration: "none",
        color: "text.primarylight",

        "&[aria-current=page]": {
          color: "text.primarylight",
          textDecoration: "none",
        },

        _hover: {
          color: "text.light1",
          textDecoration: "none",
        },
      },

      navbar: {
        color: "text.light4",
        fontWeighht: "medium",

        "&[aria-current=page]": {
          color: "text.light1",
          textDecoration: "none",
        },

        _hover: {
          color: "text.light1",
          textDecoration: "none",
        },
      },

      dangerGhost: {
        color: "text.light4",
        fontWeighht: "medium",

        _hover: {
          color: "error.subtle",
          textDecoration: "none",
        },
      },

      primary: {
        color: "text.primarylight",
        fontWeight: "medium",

        _hover: {
          color: "text.light1",
        },

        "&[aria-current=page]": {
          color: "hover",
          textDecoration: "underline",
          textUnderlineOffset: "4px",
          textDecorationThickness: "2px",
        },
      },
    },
  },

  defaultVariants: {
    variant: "nav",
  },
});

export default AppLink;
