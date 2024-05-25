/* "use client"

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
 */

"use client"

import { useEffect, useState } from "react"

export default function DarkMode({ children }) {
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


  const [theme, setTheme] = useState("light");


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

    const themeToggle = document.querySelector("#theme-toggle");

    root.style.setProperty("background-image", currentTheme.backgroundImage);
    root.style.setProperty("color", currentTheme.color);
    if (mode && linkbox) {
      console.log("=======================")
      console.log("=======================")
      console.log("=======================")
      console.log("=======================")
      console.log("=======================")
      console.log("Mode", mode)
      console.log("Linkbox", linkbox)
      console.log("=======================")
      console.log("=======================")
      console.log("=======================")
      console.log("=======================")

      mode.style.setProperty("content", currentTheme.contentIcon);
      mode.style.setProperty("left", currentTheme.left);
      linkbox.forEach((box) => {
        const description = box.querySelector(".description"); // Get the description element inside link-box
        box.style.setProperty("background-color", currentTheme.boxBackgroundColor); // Set link-box background color    
        description.style.setProperty("color", currentTheme.color); // Set description text color
      });
    }
    // themeToggle.checked = (theme == "dark") ? true : false;



  }, [theme]);

  // Choose the theme based on the theme state
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  return children;
  /*   return (
      <label className="switch">
        <input type="checkbox" id="theme-toggle" onChange={console.log(theme)} />
        <span className="slider"><span className="mode"></span></span>
      </label>
    ) */
}