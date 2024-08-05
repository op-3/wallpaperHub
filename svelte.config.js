import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess({
    postcss: {
      plugins: [tailwind, autoprefixer],
    },
  }),

  kit: {
    adapter: adapter(),
  },
};

export default config;
