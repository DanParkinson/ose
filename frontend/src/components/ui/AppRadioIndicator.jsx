import { chakra } from "@chakra-ui/react";

const AppRadioIndicator = chakra("div", {
  base: {
    width: "10px",
    height: "10px",
    borderRadius: "full",
    border: "1px solid",
    transition: "all 0.2s ease",
    flexShrink: 0,
  },
});

export default AppRadioIndicator;
