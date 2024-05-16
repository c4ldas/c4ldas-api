import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  weight: ["500"],
  subsets: ["latin"]
});

export const viewport = {
  themeColor: "#2e2e2e",
  colorScheme: "dark",
  width: "device-width",
}

export const metadata = {
  title: "c4ldas webpage",
  description: "Just a webpage",
  backgroundColor: "#3c3c3c",

  // Favicon
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },

  // Apple
  appleWebApp: {
    title: "c4ldas webpage",
    statusBarStyle: "black",
    backgroundColor: "#2e2e2e",
    touchIcons: [
      {
        sizes: "180x180",
        url: "/images/favicon.png",
        type: "image/png",
      },
    ],
    startupImage: [
      {
        url: "/images/favicon.png",
        media: "(device-width: 768px) and (device-height: 1024px)",
      }
    ]
  },

  // Itunes
  itunes: {
    appId: "686449807",
    appArgument: "t.me/@c4ldas",
  },

  // OpenGraph / Facebook
  openGraph: {
    title: "c4ldas webpage",
    description: "Just a webpage",
    url: "https://c4ldas.com.br",
    creator: "@c4ldas",
    images: "https://c4ldas-api.vercel.app/images/cover.png",
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "c4ldas webpage",
    description: "Twitter test",
    site: "https://c4ldas.com.br",
    creator: "@c4ldas",
    image: "https://c4ldas-api.vercel.app/images/cover.png",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        {children}
      </body>
    </html>
  );
}
