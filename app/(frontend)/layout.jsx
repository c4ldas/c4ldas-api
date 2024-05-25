import { Quicksand } from "next/font/google";
// import { useState, useEffect } from 'react';
import "./globals.css";
import DarkMode from "@/app/components/DarkMode";

const quicksand = Quicksand({
  weight: ["500"],
  subsets: ["latin"]
});
/* 
const lightTheme = {
  backgroundImage: "linear-gradient(117deg, rgba(58, 205, 182, 1) 0%, rgba(233, 251, 245, 1) 100%)",
  color: 'black',
  contentIcon: "url(/images/sun.svg)",
  left: "25%",
  boxBackgroundColor: "hsla(0, 0%, 100%, .6)"
};

const darkTheme = {
  backgroundImage: "linear-gradient(117deg, rgba(46, 46, 46, 1) 0%, rgba(71, 71, 71, 1) 100%)",
  color: '#f2f2f2',
  contentIcon: "url(/images/moon.svg)",
  left: "70%",
  boxBackgroundColor: "hsla(0, 100%, 100%, .2)"
};
 */

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
  /*   const [theme, setTheme] = useState("light");
  
  
    // On component mount, read the theme from localStorage
    useEffect(() => {
      const localTheme = localStorage.getItem("theme");
      setTheme(localTheme || "light");
      localStorage.setItem("theme", localTheme || "light"); // Store user preference
  
    }, []);
  
    // Update the CSS variables based on the theme
    useEffect(() => {
      const root = document.documentElement;
      const mode = document.querySelector(".mode");
      const linkbox = document.querySelectorAll(".link-box");
      // const themeToggle = document.querySelector("#theme-toggle");
  
      root.style.setProperty("background-image", currentTheme.backgroundImage);
      root.style.setProperty("color", currentTheme.color);
      mode.style.setProperty("content", url(currentTheme.contentIcon));
      mode.style.setProperty("left", currentTheme.left);
      linkbox.forEach((box) => {
        const description = box.querySelector(".description"); // Get the description element inside link-box
        box.style.setProperty("background-color", currentTheme.boxBackgroundColor); // Set link-box background color    
        description.style.setProperty("color", currentTheme.color); // Set description text color
      });
      // themeToggle.checked = (theme == "dark") ? true : false;
  
  
    }, [theme]);
  
    // Choose the theme based on the theme state
    const currentTheme = theme === "light" ? lightTheme : darkTheme; */

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={quicksand.className}>
        <DarkMode>
          {children}
        </DarkMode>
      </body>
    </html>
  );
}
