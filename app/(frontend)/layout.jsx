import { Quicksand } from "next/font/google";
import { ThemeProvider } from 'next-themes';

// CSS imports
import "@/public/css/globals.css";
import "@/public/css/darkmode.css";
import "@/public/css/pagesize.css";

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

  // Google verification
  verification: {
    google: "wVXxQkHea9Zos1LW8_q9VVXEEkl3zin6kocrTnK3syA",
  },

  // Favicon
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },

  // Apple
  webApp: {
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

  // OpenGraph / Facebook
  openGraph: {
    title: "c4ldas webpage",
    description: "Just a webpage",
    url: "https://c4ldas.com.br",
    creator: "@c4ldas",
    images: "/images/cover.png",
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "c4ldas webpage",
    description: "Just a webpage",
    site: "https://c4ldas.com.br",
    creator: "@c4ldas",
    image: "/images/cover.png",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body className={quicksand.className}>
        <ThemeProvider attribute="class">{children}</ThemeProvider>
      </body>
    </html>
  );
}
