export const STORAGE_KEY = "todos";

export function loadTodos() {
    try {
        const storedTodos = localStorage.getItem(STORAGE_KEY);

        if (!storedTodos) {
            return [];
        }

        const parsedTodos = JSON.parse(storedTodos);

        return Array.isArray(parsedTodos) ? parsedTodos : [];
    } catch (error) {
        console.error("Could not load todos:", error);
        return [];
    }
}

export function saveTodos(todos) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
        console.error("Could not save todos:", error);
    }
}
