import { chakra, Switch } from "@chakra-ui/react";
import { HiCheck, HiX } from "react-icons/hi";

const AppSwitchControl = chakra(Switch.Control, {
  base: {
    bg: "red.500",
    borderColor: "red.500",
    transition: "all 0.2s ease",

    _hover: {
      opacity: 0.9,
    },

    _checked: {
      bg: "green.500",
      borderColor: "green.500",
      color: "white",
    },

    _focusVisible: {
      outline: "2px solid",
      outlineColor: "focusRing",
      outlineOffset: "2px",
    },
  },
});

const AppSwitch = ({
  checked,
  onCheckedChange,
  children,
  ...props
}) => {
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      {...props}
    >
      <Switch.HiddenInput />

      <AppSwitchControl>
        <Switch.Thumb>
          <Switch.ThumbIndicator
            fallback={<HiX size={12} />}
          >
            <HiCheck size={12} />
          </Switch.ThumbIndicator>
        </Switch.Thumb>
      </AppSwitchControl>

      {children && (
        <Switch.Label color="text.light1">
          {children}
        </Switch.Label>
      )}
    </Switch.Root>
  );
};

export default AppSwitch;
