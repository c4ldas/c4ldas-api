"use client"

import { useEffect } from "react"

export default function DarkMode() {
  useEffect(() => {
    // Check for saved theme preference, returns null if not set
    const currentTheme = localStorage.getItem("theme");

    // Check system wide preference
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Set initial theme
    const theme = currentTheme || (prefersDarkMode ? "dark" : "light");

    // Set theme
    setTheme(theme);
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

/* 
function darkMode() {
  const root = document.documentElement;
  const mode = document.querySelector(".mode");
  const linkbox = document.querySelectorAll(".link-box");
  const themeToggle = document.querySelector("#theme-toggle");

  localStorage.setItem("theme", "dark"); // Store user preference
  root.style.setProperty("background-image", "var(--bg-dark)"); // Background color
  root.style.setProperty("color", "var(--text-dark)"); // Font color
  mode.style.setProperty("content", "url('../images/moon.svg')"); // Change image to moon
  mode.style.setProperty("left", "70%"); // Change position of the moon image
  linkbox.forEach((box) => {
    box.style.setProperty("background-color", "var(--box-bg-dark)"); // Set link-box background color
    const description = box.querySelector(".description"); // Get the description element inside link-box
    description.style.setProperty("color", "var(--text-dark)"); // Set description text color
  });
  themeToggle.checked = true;
}

function lightMode() {
  const root = document.documentElement;
  const mode = document.querySelector(".mode");
  const linkbox = document.querySelectorAll(".link-box");
  const themeToggle = document.querySelector("#theme-toggle");

  localStorage.setItem("theme", "light"); // Store user preference
  root.style.setProperty("background-image", "var(--bg-light)"); // Background color
  root.style.setProperty("color", "var(--text-light)"); // Font color
  mode.style.setProperty("content", "url('../images/sun.svg')"); // Change image to sun
  mode.style.setProperty("left", "25%"); // Change position of the sun image
  linkbox.forEach((box) => {
    box.style.setProperty("background-color", "var(--box-bg-light)"); // Set link-box background color
    const description = box.querySelector(".description"); // Get the description element inside link-box
    description.style.setProperty("color", "var(--text-light)"); // Set description text color
  });
  themeToggle.checked = false;
}
 */


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





/* 
export default function DarkMode() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
      const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      prefersDarkMode ? darkMode() : lightMode();
      return;
    }
    savedTheme == "dark" ? darkMode() : lightMode();
  }, []);
} 
*/




/*
export default function DarkMode() {
  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = currentTheme || (prefersDarkMode ? "dark" : "light");
    theme === "dark" ? darkMode() : lightMode();
  }, []);
}
*/