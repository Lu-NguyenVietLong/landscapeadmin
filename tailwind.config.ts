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
          DEFAULT: "rgb(105,108,255)",
          second: "rgb(50,71,92)"
        },
        background: {
          DEFAULT: "rgb(245, 245, 249)",
        },
      },
      boxShadow: {
        default: "0px 1px 6px -2px rgba(50, 71, 93, 0.1)",
        box: "0px 1px 7px -2px rgba(50, 71, 92, 0.1)",
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
