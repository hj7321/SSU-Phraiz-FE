import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        main: "#CDC1FF",
        sub: "#A294F9",
      },
      fontFamily: {
        ghanachoco: ['"ghanachoco"', "sans-serif"],
        "nanum-light": ['"NanumSquareAcl"', "sans-serif"],
        "nanum-bold": ['"NanumSquareAcb"', "sans-serif"],
        "nanum-extrabold": ['"NanumSquareAceb"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
