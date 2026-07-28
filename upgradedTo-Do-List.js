// DOM Elements
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const filters = Array.from(document.querySelectorAll(".filter"));
const clearCompletedBtn = document.getElementById("clear-completed");
const STORAGE_KEY = "todos";

// State
let todos = [];
let currentFilter = "all";
let editingId = null;

function loadTodos() {
    try {
        const storedTodos = localStorage.getItem(STORAGE_KEY);

        if (storedTodos) {
            const parsedTodos = JSON.parse(storedTodos);

            if (Array.isArray(parsedTodos)) {
                todos = parsedTodos;
            }
        }
    } catch (error) {
        console.error("Could not load todos:", error);
    }
}

function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function createTodoElement(todo) {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.dataset.id = todo.id;

    if (todo.completed) {
        li.classList.add("completed");
    }

    const textSpan = document.createElement("span");
    textSpan.className = "todo-text";

    if (editingId === todo.id) {
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = todo.text;
        editInput.className = "edit-input";

        editInput.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                const newText = editInput.value.trim();

                if (newText) {
                    todo.text = newText;
                }

                editingId = null;
                saveTodos();
                renderTodos();
            }

            if (event.key === "Escape") {
                editingId = null;
                renderTodos();
            }
        });

        editInput.addEventListener("blur", function() {
            const newText = editInput.value.trim();

            if (newText) {
                todo.text = newText;
            }

            editingId = null;
            saveTodos();
            renderTodos();
        });

        editInput.focus();
        editInput.select();
        li.appendChild(editInput);
    } else {
        textSpan.textContent = todo.text;
        li.appendChild(textSpan);
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function(event) {
        event.stopPropagation();
        deleteTodo(todo.id);
    });

    li.appendChild(deleteBtn);
    return li;
}

function renderTodos() {
    if (!todoList) {
        return;
    }

    todoList.innerHTML = "";

    const filteredTodos = todos.filter(function(todo) {
        if (currentFilter === "active") {
            return !todo.completed;
        }

        if (currentFilter === "completed") {
            return todo.completed;
        }

        return true;
    });

    filteredTodos.forEach(function(todo) {
        todoList.appendChild(createTodoElement(todo));
    });

    updateStats();
}

function addTodo(text) {
    const safeText = text.trim();

    if (!safeText) {
        return;
    }

    todos.unshift({
        id: Date.now() + Math.random(),
        text: safeText,
        completed: false,
    });

    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map(function(todo) {
        if (todo.id === id) {
            return {
                ...todo,
                completed: !todo.completed,
            };
        }

        return todo;
    });

    saveTodos();
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(function(todo) {
        return todo.id !== id;
    });

    if (editingId === id) {
        editingId = null;
    }

    saveTodos();
    renderTodos();
}

function updateStats() {
    const remainingItems = todos.filter(function(todo) {
        return !todo.completed;
    }).length;

    if (itemsLeft) {
        itemsLeft.textContent = `${remainingItems} item${remainingItems === 1 ? "" : "s"} left`;
    }
}

function filterTodos(filter) {
    currentFilter = filter;

    filters.forEach(function(button) {
        button.classList.toggle("active", button.dataset.filter === filter);
    });

    renderTodos();
}

if (form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        addTodo(input.value);
        input.value = "";
        input.focus();
    });
}

todoList.addEventListener("click", function(event) {
    const item = event.target.closest(".todo-item");

    if (!item) {
        return;
    }

    if (event.target.classList.contains("delete-btn") || event.target.closest(".delete-btn")) {
        event.stopPropagation();
        deleteTodo(Number(item.dataset.id));
        return;
    }

    if (event.target.classList.contains("edit-input")) {
        return;
    }

    toggleTodo(Number(item.dataset.id));
});

todoList.addEventListener("dblclick", function(event) {
    const item = event.target.closest(".todo-item");

    if (item && !event.target.closest(".delete-btn")) {
        editingId = Number(item.dataset.id);
        renderTodos();
    }
});

if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener("click", function() {
        todos = todos.filter(function(todo) {
            return !todo.completed;
        });

        editingId = null;
        saveTodos();
        renderTodos();
    });
}

filters.forEach(function(button) {
    button.addEventListener("click", function() {
        filterTodos(button.dataset.filter);
    });
});

loadTodos();
renderTodos();

// Updated toggleTodo
function toggleTodo(id) {
    const todos = loadTodos();
    const todo = todos.find(t => t.id === id);
    
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos(todos);
        renderTodos();
    }
}

// Updated deleteTodo
function deleteTodo(id) {
    let todos = loadTodos();
    todos = todos.filter(t => t.id !== id);
    saveTodos(todos);
    renderTodos();
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    renderTodos();
});