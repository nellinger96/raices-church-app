import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Iglesia de Todos los Días",
    short_name: "Todos los Días",
    description:
      "App de Iglesia de Todos los Días: anuncios, ministerios, Hoy con Dios, testimonios, oración y donaciones.",
    start_url: "/todos-los-dias",
    scope: "/todos-los-dias",
    display: "standalone",
    orientation: "portrait",
    background_color: "#071A33",
    theme_color: "#071A33",
    categories: ["religion", "community"],
    icons: [
      {
        src: "/todos-los-dias/app-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/todos-los-dias/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/todos-los-dias/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
