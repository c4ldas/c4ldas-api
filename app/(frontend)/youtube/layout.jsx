export const metadata = {
  title: "c4ldas - Youtube",
  description: "Find your Youtube channel ID",

  // OpenGraph / Facebook
  openGraph: {
    title: "c4ldas - Youtube",
    description: "Find your Youtube channel ID",
    url: "https://c4ldas.com.br",
    creator: "@c4ldas",
    images: "/images/cover/youtube.png",
  },

  // Twitter
  twitter: {
    title: "c4ldas - Youtube",
    description: "Find your Youtube channel ID",
    site: "https://c4ldas.com.br",
    creator: "@c4ldas",
    image: "/images/cover/youtube.png",
  }
};

export default function Layout({ children }) {
  return (
    <>
      {children}
    </>
  );
}