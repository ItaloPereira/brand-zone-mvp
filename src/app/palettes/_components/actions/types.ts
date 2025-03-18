import type { PaletteItem } from "../../types";

export type ButtonProps = {
  variant?: "icon" | "button" | "popover";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onClick?: () => void;
};

export type PaletteActionButtonProps = ButtonProps & {
  palette: PaletteItem;
}; 