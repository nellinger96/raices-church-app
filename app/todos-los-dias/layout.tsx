import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: {
    default: "Iglesia de Todos los Días",
    template: "%s | Iglesia de Todos los Días",
  },
  description:
    "App de Iglesia de Todos los Días: anuncios, ministerios, Hoy con Dios, testimonios, oración y donaciones.",
  applicationName: "Todos los Días",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Todos los Días",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      {
        url: "/todos-los-dias/app-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/todos-los-dias/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/todos-los-dias/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#071A33",
  width: "device-width",
  initialScale: 1,
};

export default function TodosLosDiasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
