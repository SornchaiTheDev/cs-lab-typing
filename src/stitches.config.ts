import {
  gray,
  blue,
  red,
  green,
  slate,
  lime,
  grayDark,
  blueDark,
  redDark,
  greenDark,
} from "@radix-ui/colors";

// Spread the scales in your light and dark themes
import { createStitches } from "@stitches/react";

export const { styled, createTheme } = createStitches({
  theme: {
    colors: {
      ...gray,
      ...blue,
      ...red,
      ...green,
      ...slate,
      ...lime,
    },
  },
});

const darkTheme = createTheme({
  colors: {
    ...grayDark,
    ...blueDark,
    ...redDark,
    ...greenDark,
  },
});
