"use client"

import { useEffect } from "react";

export default function Musica() {
  useEffect(() => {
    window.location.assign("/spotify");
  }, []);

  return null;
}