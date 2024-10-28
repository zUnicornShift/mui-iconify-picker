import type {Meta, StoryObj} from "@storybook/react";

import IconifyPicker from "./IconifyPicker.tsx";

const meta: Meta<typeof IconifyPicker> = {
  component: IconifyPicker,
};

export default meta;
type Story = StoryObj<typeof IconifyPicker>;

export const Medium: Story = {
  args: {
    inputProps: {
      size: "medium",
    },
  },
};

export const Small: Story = {
  args: {
    inputProps: {
      size: "small",
    },
  },
};

export const Outlined: Story = {
  args: {
    inputProps: {
      size: "small",
    },
    variant: "outlined",
  },
};

export const Filled: Story = {
  args: {
    inputProps: {
      size: "small",
    },
    variant: "filled",
  },
};

export const Selected: Story = {
  args: {
    inputProps: {
      size: "small",
    },
    variant: "outlined",
    value: "mdi:airplane",
  },
};

export const Prefix: Story = {
  args: {
    inputProps: {
      size: "small",
    },
    variant: "outlined",
    prefix: "mdi",
  },
};
