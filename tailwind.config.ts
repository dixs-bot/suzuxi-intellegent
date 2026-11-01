import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { ink: "#172033", muted: "#687386", line: "#e8ebf0", brand: "#173f73", soft: "#f5f7fa" }, boxShadow: { soft: "0 8px 30px rgba(20,35,60,.06)" } } },
  plugins: []
};
export default config;
