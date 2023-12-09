import { type Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },

  plugins: [
    require("windy-radix-palette"),
    require("windy-radix-typography"),
    require("@tailwindcss/typography"),
    // require("@tailwindcss/forms"),
  ],
} satisfies Config;
