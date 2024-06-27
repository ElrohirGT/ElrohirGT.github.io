import Unfonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    Unfonts({
      google: {
        families: ["Source Code Pro"],
      },
    }),
  ],
  resolve: {
    alias: {
      src: "/src",
    },
  },
});
