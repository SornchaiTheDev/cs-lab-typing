import { type Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      animation : {
        loading : "moving-line 1.6s linear infinite"
      },
      keyframes: {
        "moving-line": {
          "100%": { "background-position" : "360px" }, 
          
        },
      },
    },
  },

  plugins: [
    require("windy-radix-palette"),
    require("windy-radix-typography"),
    require("@tailwindcss/typography"),
    // require("@tailwindcss/forms"),
  ],
} satisfies Config;
