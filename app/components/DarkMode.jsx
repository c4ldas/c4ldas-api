"use client"

import { useEffect } from "react"

export default function DarkMode() {
  useEffect(() => {
    const currentTheme = localStorage.getItem("theme"); // Check saved theme preference
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches; // Check system preference    
    const theme = currentTheme || (prefersDarkMode ? "dark" : "light"); // Assign it to theme
    setTheme(theme); // Set theme
  }, []);

  return (
    <label className="switch">
      <input type="checkbox" id="theme-toggle" onChange={handleToggle} />
      <span className="slider"><span className="mode"></span></span>
    </label>
  )
}

function handleToggle(event) {
  const newTheme = event.target.checked ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
  setTheme(newTheme);
}

function setTheme(theme) {
  const root = document.documentElement;
  const mode = document.querySelector(".mode");
  const linkbox = document.querySelectorAll(".link-box");
  const themeToggle = document.querySelector("#theme-toggle");
  const darkIcon = "/images/moon.svg";
  const lightIcon = "/images/sun.svg";
  const darkPosition = "70%";
  const lightPosition = "25%";

  root.style.setProperty("background-image", `var(--bg-${theme})`); // Background color
  root.style.setProperty("color", `var(--text-${theme})`); // Font color
  mode.style.setProperty("content", `url(${theme == "dark" ? darkIcon : lightIcon})`); // Change image to moon or sun
  mode.style.setProperty("left", `${theme === 'dark' ? darkPosition : lightPosition}`); // Change position of the image
  linkbox.forEach((box) => {
    const description = box.querySelector(".description"); // Get the description element inside link-box
    box.style.setProperty("background-color", `var(--box-bg-${theme})`); // Set link-box background color    
    description.style.setProperty("color", `var(--text-${theme})`); // Set description text color
  });
  localStorage.setItem("theme", theme); // Store user preference
  themeToggle.checked = (theme == "dark") ? true : false;
}

