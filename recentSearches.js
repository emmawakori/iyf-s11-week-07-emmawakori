    const input = document.getElementById("search-input");
    const button = document.getElementById("search-btn");
    const historyBox = document.getElementById("search-history");

    let recentSearches = [];

    function updateHistory() {
      historyBox.innerHTML = "";
      recentSearches.forEach((term) => {
        const item = document.createElement("div");
        item.textContent = term;
        item.onclick = () => {
          input.value = term;
          performSearch(term);
        };
        historyBox.appendChild(item);
      });
      historyBox.style.display = recentSearches.length ? "block" : "none";
    }

    function performSearch(term) {
      alert("Searching for: " + term); // Replace with real search logic
    }

    button.onclick = () => {
      const term = input.value.trim();
      if (term) {
        // Add to history (max 5, no duplicates)
        recentSearches = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
        updateHistory();
        performSearch(term);
      }
    };

    input.addEventListener("focus", updateHistory);
    input.addEventListener("blur", () => {
      setTimeout(() => historyBox.style.display = "none", 200);
    });
  

    