import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  weight: ["500"],
  subsets: ["latin"]
});

export const metadata = {
  title: "c4ldas webpage",
  description: "Just a webpage",

  // Favicon
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },

  // OpenGraph / Facebook
  openGraph: {
    title: "c4ldas webpage",
    description: "Just a webpage",
    url: "https://c4ldas.com.br",
    creator: "@c4ldas",
    images: "https://c4ldas.com.br/images/seapi-cover.png",
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "c4ldas webpage",
    description: "Twitter test",
    site: "https://c4ldas.com.br",
    creator: "@c4ldas",
    image: "https://c4ldas.com.br/images/seapi-cover.png",
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
