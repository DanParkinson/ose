import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
} from "@chakra-ui/react";

const buttonRecipe = defineRecipe({
  variants: {
    variant: {
      cta: {
        bg: "bg.light1",
        color: "text.inverted",

        _hover: {
          bg: "bg.primarylight",
        },

        _focusVisible: {
          outline: "2px solid",
          outlineColor: "focusRing",
          outlineOffset: "5px",
          borderRadius: "sm",
        },
      },

      primary: {
        bg: "bg.primarylight",
        color: "text.dark3",

        _hover: {
          bg: "bg.primarydark",
          color: "text.light1",
        },

        _active: {
          bg: "bg.primarydark",
        },

        _focusVisible: {
          outline: "2px solid white",
          outlineOffset: "2px",
          borderRadius: "sm",
        },
      },

      contrast: {
        bg: "bg.contrast",
        color: "text.dark",

        _hover: {
          bg: "hover.contrast",
          color: "text.primary",
        },

        _active: {
          bg: "hover.contrast",
        },

        _focusVisible: {
          outline: "2px solid",
          outlineColor: "focusRing",
          outlineOffset: "2px",
        },
      },

      dangerGhost: {
        color: "text.muted",
        bg: "transparent",

        _hover: {
          color: "error",
          bg: "error.subtle",
        },

        _active: {
          color: "error",
          bg: "error.subtle",
        },

        _focusVisible: {
          outline: "2px solid",
          outlineColor: "focusRing",
          outlineOffset: "2px",
        },
      },

      dashboardTitleRow: {
        w: "80%",
        justifyContent: "flex-start",
        px: 0,
        py: 0,

        bg: "transparent",
        color: "text.light1",
        fontWeight: "semibold",
        textAlign: "left",

        _active: {
          bg: "transparent",
        },

        _focusVisible: {
          outline: "2px solid",
          outlineColor: "focusRing",
          outlineOffset: "2px",
          borderRadius: "sm",
        },
      },

    },
  },
});

const config = defineConfig({
  globalCss: {
    "*": {
      scrollbarWidth: "thin",
      scrollbarColor:
        "var(--chakra-colors-text-primarylight) transparent",
    },

    "*::-webkit-scrollbar": {
      width: "6px",
      height: "6px",
    },

    "*::-webkit-scrollbar-track": {
      background: "transparent",
    },

    "*::-webkit-scrollbar-thumb": {
      background: "var(--chakra-colors-text-primarylight)",
      borderRadius: "999px",
    },

    "*::-webkit-scrollbar-thumb:hover": {
      background: "var(--chakra-colors-text-primarylight)",
    },

    "input::-ms-reveal": {
      display: "none",
    },

    "input::-ms-clear": {
      display: "none",
    },
  },

  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: "#f3faf5" },
          100: { value: "#e6f4ea" },
          200: { value: "#cce9d5" },
          300: { value: "#a3d9b8" },
          400: { value: "#72c59a" },
          500: { value: "#4caf7d" },
          600: { value: "#3e8f67" },
          700: { value: "#2f6f51" },
          800: { value: "#21503b" },
          900: { value: "#153726" },
        },

        secondary: {
          50: { value: "#f0fdfa" },
          100: { value: "#ccfbf1" },
          200: { value: "#99f6e4" },
          300: { value: "#5eead4" },
          400: { value: "#2dd4bf" },
          500: { value: "#14b8a6" },
          600: { value: "#0f9488" },
          700: { value: "#0d746c" },
          800: { value: "#115e59" },
          900: { value: "#134e4a" },
        },

        neutral: {
          50: { value: "#f7f7f7" },
          100: { value: "#e5e5e5" },
          200: { value: "#d4d4d4" },
          300: { value: "#a3a3a3" },
          400: { value: "#737373" },
          500: { value: "#525252" },
          600: { value: "#3f3f3f" },
          700: { value: "#2b2b2b" },
          800: { value: "#1f1f1f" },
          900: { value: "#141414" },
        },

        success: {
          500: { value: "#22c55e" },
          600: { value: "#16a34a" },
        },

        warning: {
          500: { value: "#fbbf24" },
          600: { value: "#d97706" },
        },

        error: {
          500: { value: "#f87171" },
          600: { value: "#dc2626" },
        },

        info: {
          500: { value: "#3b82f6" },
          600: { value: "#2563eb" },
        },
      },

      spacing: {
        1: { value: "0.25rem" },
        2: { value: "0.5rem" },
        3: { value: "0.75rem" },
        4: { value: "1rem" },
        5: { value: "1.25rem" },
        6: { value: "1.75rem" },
        8: { value: "2.5rem" },
        10: { value: "3.75rem" },
        12: { value: "6.25rem" },
      },

      radii: {
        sm: { value: "0.25rem" },
        md: { value: "0.375rem" },
        lg: { value: "0.5rem" },
        xl: { value: "0.75rem" },
      },

      shadows: {
        xs: { value: "0 1px 2px rgba(15, 23, 42, 0.04)" },
        sm: { value: "0 1px 3px rgba(15, 23, 42, 0.08)" },
        md: { value: "0 4px 6px rgba(15, 23, 42, 0.08)" },
        lg: { value: "0 10px 15px rgba(15, 23, 42, 0.08)" },
        topSm: { value: "0 -2px 8px rgba(15, 23, 42, 0.12)" },
      },
    },

    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: "{colors.neutral.200}" },

          light1: { value: "{colors.neutral.50}" },
          light2: { value: "{colors.neutral.100}" },
          light3: { value: "{colors.neutral.200}" },
          light4: { value: "{colors.neutral.300}" },
          light5: { value: "{colors.neutral.400}" },

          dark1: { value: "{colors.neutral.900}" },
          dark2: { value: "{colors.neutral.800}" },
          dark3: { value: "{colors.neutral.700}" },
          dark4: { value: "{colors.neutral.600}" },
          dark5: { value: "{colors.neutral.500}" },

          transparentdark: { value: "rgba(20, 20, 20, 0.75)" },
          primarydark: { value: "{colors.primary.700}" },
          primarylight: { value: "{colors.primary.400}" },
          contrast: { value: "{colors.neutral.50}" },
        },

        text: {
          DEFAULT: { value: "{colors.neutral.700}" },

          light1: { value: "{colors.neutral.50}" },
          light2: { value: "{colors.neutral.100}" },
          light3: { value: "{colors.neutral.200}" },
          light4: { value: "{colors.neutral.300}" },
          light5: { value: "{colors.neutral.400}" },

          dark1: { value: "{colors.neutral.900}" },
          dark2: { value: "{colors.neutral.800}" },
          dark3: { value: "{colors.neutral.700}" },
          dark4: { value: "{colors.neutral.600}" },
          dark5: { value: "{colors.neutral.500}" },

          primarydark: { value: "{colors.primary.700}" },
          primarylight: { value: "{colors.primary.400}" },
        },

        border: {
          DEFAULT: { value: "{colors.neutral.300}" },

          light1: { value: "{colors.neutral.50}" },
          light2: { value: "{colors.neutral.200}" },
          light3: { value: "{colors.neutral.300}" },

          dark1: { value: "{colors.neutral.700}" },
          dark2: { value: "{colors.neutral.600}" },
          dark3: { value: "{colors.neutral.500}" },
        },

        hover: {
          DEFAULT: { value: "{colors.primary.600}" },

          light: { value: "{colors.primary.400}" },
          dark: { value: "{colors.primary.700}" },

          contrast: { value: "{colors.neutral.50}" },
        },

        success: {
          DEFAULT: { value: "{colors.success.500}" },
          subtle: { value: "#dcfce7" },
          contrast: { value: "#052e16" },
        },

        warning: {
          DEFAULT: { value: "{colors.warning.500}" },
          subtle: { value: "#fef3c7" },
          contrast: { value: "#78350f" },
        },

        error: {
          DEFAULT: { value: "{colors.error.500}" },
          subtle: { value: "#f87171" },
          contrast: { value: "#7f1d1d" },
        },

        info: {
          DEFAULT: { value: "{colors.info.500}" },
          subtle: { value: "#e0f2fe" },
          contrast: { value: "#082f49" },
        },

        focusRing: {
          DEFAULT: { value: "{colors.primary.600}" },
        },
      },
    },

    recipes: {
      button: buttonRecipe,
    },
  },
});

const system = createSystem(defaultConfig, config);

export default system;
