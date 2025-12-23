export const metadata = {
  title: "c4ldas - TFT",
  description: "TFT commands to be used on stream",

  // OpenGraph / Facebook
  openGraph: {
    title: "c4ldas - TFT",
    description: "TFT commands to be used on stream",
    url: "https://c4ldas.com.br",
    creator: "@c4ldas",
    images: "/images/cover/tft.png",
  },

  // Twitter
  twitter: {
    title: "c4ldas - TFT",
    description: "TFT commands to be used on stream",
    site: "https://c4ldas.com.br",
    creator: "@c4ldas",
    image: "/images/cover/tft.png",
  }
};

export default function Layout({ children }) {
  return (
    <>
      {children}
    </>
  );
}