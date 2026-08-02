// sessionStorage - cleared when browser tab closes
sessionStorage.setItem("tempData", "This disappears on close");

// localStorage - persists until explicitly cleared
localStorage.setItem("permanentData", "This stays forever");

// When to use which:
// - sessionStorage: Shopping cart (for current session)
// - sessionStorage: Form data backup (in case of accidental navigation)
// - localStorage: User preferences, theme settings
// - localStorage: Authentication tokens (with security considerations)
// - localStorage: Cached API data
// Save temporary data
sessionStorage.setItem("draftMessage", "Hello, still editing...");

// Save permanent data
localStorage.setItem("theme", "dark");

// Retrieve
console.log(sessionStorage.getItem("draftMessage")); // "Hello, still editing..."
console.log(localStorage.getItem("theme"));          // "dark"


  const FORM_KEY = "autosaveForm";

  const form = document.getElementById("userForm");

  // Load saved data on page load
  document.addEventListener("DOMContentLoaded", () => {
    const savedData = JSON.parse(sessionStorage.getItem(FORM_KEY) || "{}");
    for (const [name, value] of Object.entries(savedData)) {
      if (form.elements[name]) {
        form.elements[name].value = value;
      }
    }
  });

  // Save data as user types
  form.addEventListener("input", (event) => {
    const savedData = JSON.parse(sessionStorage.getItem(FORM_KEY) || "{}");
    savedData[event.target.name] = event.target.value;
    sessionStorage.setItem(FORM_KEY, JSON.stringify(savedData));
  });

  const contactForm = document.getElementById("contact-form");
const inputs = contactForm.querySelectorAll("input, textarea");

// Save on every input
inputs.forEach(input => {
    // Load saved value on page load
    const saved = sessionStorage.getItem(`form_${input.name}`);
    if (saved) {
        input.value = saved;
    }
    
    // Save on input
    input.addEventListener("input", () => {
        sessionStorage.setItem(`form_${input.name}`, input.value);
    });
});

// Clear on successful submit
contactForm.addEventListener("submit", () => {
    inputs.forEach(input => {
        sessionStorage.removeItem(`form_${input.name}`);
    });
});