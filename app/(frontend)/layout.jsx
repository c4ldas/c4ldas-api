import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  weight: ["500"],
  subsets: ["latin"]
});

export const metadata = {
  title: "c4ldas webpage",
  description: "Just a webpage for c4ldas",
  // icon: "https://static-cdn.jtvnw.net/jtv_user_pictures/451dd285-491d-49e0-b1e0-20147f3ab56b-profile_image-70x70.png",

  // OpenGraph / Facebook
  openGraph: {
    title: "c4ldas webpage",
    description: "Test test openGraph",
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



// { /* <!-- Primary Meta Tags -->*/ }
// <meta name="title" content="Streamelements Overlay Sharing Tool - by c4ldas" />
// <meta name="description" content="Share and install overlays with a simple code. Have your overlays installed with minimum effort!" />

// { /* <!-- Open Graph / Facebook --> */ }
// <meta property="og:type" content="website" />
// <meta property="og:url" content="https://seapi.c4ldas.com.br/overlays" />
// <meta property="og:title" content="Streamelements Overlay Sharing Tool - by c4ldas" />
// <meta property="og:description" content="Share and install overlays with a simple code. Have your overlays installed with minimum effort!" />
// <meta property="og:image" content="https://c4ldas.com.br/images/seapi-cover.png" />

// { /* <!-- Twitter --> */ }
// <meta property="twitter:card" content="summary_large_image" />
// <meta property="twitter:url" content="https://seapi.c4ldas.com.br/overlays" />
// <meta property="twitter:title" content="Streamelements Overlay Sharing Tool - by c4ldas" />
// <meta property="twitter:description" content="Share and install overlays with a simple code. Have your overlays installed with 
// inimum effort!" />
// <meta property="twitter:image" content="https://c4ldas.com.br/images/seapi-cover.png" />
