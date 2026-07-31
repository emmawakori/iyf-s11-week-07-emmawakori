// Everything mixed together...
const button = document.getElementById("btn");
let count = 0;
function increment() { count++; }
button.addEventListener("click", increment);
localStorage.setItem("count", count);
// ... 500 more lines

// Pure utility functions
export function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const STORAGE_PREFIX = "myapp_";

export function save(key, data) {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
}

export function load(key, defaultValue = null) {
    const data = localStorage.getItem(STORAGE_PREFIX + key);
    return data ? JSON.parse(data) : defaultValue;
}

export function remove(key) {
    localStorage.removeItem(STORAGE_PREFIX + key);
}