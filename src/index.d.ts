import {InputProps} from "@mui/material/Input";
import {FilledInputProps} from "@mui/material/FilledInput";
import {PopoverProps} from "@mui/material/Popover";
import {OutlinedInputProps} from "@mui/material/OutlinedInput";
import React from "react";

export interface IconifyPickerProps<V, I> {
  inputProps?: Omit<I, "inputComponent">;
  popoverProps?: Omit<
    PopoverProps,
    "open" | "anchorEl" | "onClose" | "children"
  >;
  value?: string | null;
  onChange?: (value: string | null, e: React.MouseEvent<HTMLElement>) => void;
  placeholderText?: string;
  slots?: {
    loading?: React.ComponentType;
    error?: React.ComponentType;
  };
  apiBaseUrl?: string | URL;
  initIcons?: string[];
  prefixes?: string;
  prefix?: string;
  category?: string;
  limit?: number;
  variant?: V;
}

declare class IconifyPicker extends React.Component<
  | IconifyPickerProps<"filled", FilledInputProps>
  | IconifyPickerProps<"standard", InputProps>
  | IconifyPickerProps<"outlined", OutlinedInputProps>
> {}

export default IconifyPicker;
