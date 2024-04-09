import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{tsx,ts}"],
  theme: {
    extend: {
      fontFamily: {
        heading: "var(--font-heading)",
      },
      spacing: {
        "15px": "15px",
        "25px": "25px",
        "30px": "30px",
        "32px": "32px",
        "50px": "50px",
        "60px": "60px",
        "70px": "70px",
        "80px": "80px",
        "100px": "100px",
      },
      colors: {
        primary: {
          lighter: "#90EE90",
          light: "#7CFC00",
          DEFAULT: "#6B8E23",
          dark: "#228B22",
          darker: "#006400",
        },
        foreground: {
          DEFAULT: "#ADFF2F",
        },
        second: {
          DEFAULT: "#8E8E93",
        },
      },
      boxShadow: {
        default: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        second: "0px 4px 18px 0px rgba(0, 0, 0, 0.01)",
        xs: "0px 1px 2px 0px #1018280d",
        box: "0px 4px 26px 0px rgba(66, 71, 76, 0.2)",
      },
      transitionProperty: {
        "max-height": "max-height",
      },
      keyframes: {
        scale: {
          "0%": { transform: "scale(0.8)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(0.8)" },
        },
      },
      animation: {
        scale: "scale 3s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
