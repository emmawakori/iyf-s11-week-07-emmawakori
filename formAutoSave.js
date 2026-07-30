 const form = document.getElementById('myForm');
    const storageKey = 'formData';

    // Recover saved data on page load
    window.addEventListener('load', () => {
      const savedData = JSON.parse(localStorage.getItem(storageKey));
      if (savedData) {
        Object.keys(savedData).forEach(key => {
          if (form.elements[key]) {
            form.elements[key].value = savedData[key];
          }
        });
      }
    });

    // Auto-save every 5 seconds
    setInterval(() => {
      const data = {};
      Array.from(form.elements).forEach(el => {
        if (el.name) data[el.name] = el.value;
      });
      localStorage.setItem(storageKey, JSON.stringify(data));
    }, 5000);

    // Clear saved data on submit
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // prevent actual submission for demo
      localStorage.removeItem(storageKey);
      alert('Form submitted and saved data cleared!');
      form.reset();
    });