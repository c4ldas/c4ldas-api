"use client"

import Image from "next/image";
import Link from "next/link";
import DarkMode from "./DarkMode";

export default function Header() {

  return (

    <header className="header">

      <Link href="#">
        <Image
          src="https://static-cdn.jtvnw.net/jtv_user_pictures/451dd285-491d-49e0-b1e0-20147f3ab56b-profile_image-300x300.png"
          className="image"
          alt="Avatar image"
          width={300}
          height={300}
          quality={100}
        />
      </Link>
      <DarkMode />
    </header>
  )
}

