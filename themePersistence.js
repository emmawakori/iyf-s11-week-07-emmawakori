const toggleBtn = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");

// Apply saved theme on page load
if (currentTheme) {
  document.body.classList.add(currentTheme);
} else {
  document.body.classList.add("light"); // default theme
}

// Toggle theme on button click
toggleBtn.addEventListener("click", () => {
  if (document.body.classList.contains("light")) {
    document.body.classList.replace("light", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.replace("dark", "light");
    localStorage.setItem("theme", "light");
  }
});
