import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  ssr: false, // desactivar renderizado del lado del servidor -> SPA activado

  devServer: {
    port: 3001
  },

  /* Tailwind CSS */
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss() as any
    ],
  },
})
