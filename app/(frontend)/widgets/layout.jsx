export const metadata = {
  title: "c4ldas - Custom widgets",
  description: "Widgets created by me for StreamElements overlays",

  // OpenGraph / Facebook
  openGraph: {
    title: "c4ldas - Custom widgets",
    description: "Widgets created by me for StreamElements overlays",
    url: "https://c4ldas.com.br",
    creator: "@c4ldas",
    images: "/images/cover/home.png",
  },

  // Twitter
  twitter: {
    title: "c4ldas - Custom widgets",
    description: "Widgets created by me for StreamElements overlays",
    site: "https://c4ldas.com.br",
    creator: "@c4ldas",
    image: "/images/cover/home.png",
  }
};

export default function Layout({ children }) {
  return (
    <>
      {children}
    </>
  );
}