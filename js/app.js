import {
    addTodo,
    clearCompletedTodos,
    createState,
    deleteTodo,
    getFilteredTodos,
    getRemainingCount,
    setCurrentFilter,
    setEditingId,
    setTodos,
    toggleTodo,
} from "./state.js";
import { fetchTodosFromApi, saveTodosToApi } from "./api.js";
import { loadTodos, saveTodos } from "./storage.js";
import { getElements, renderTodoList, updateFilterButtons, updateStats } from "./ui.js";
import { createId, sanitizeText } from "./utils.js";

const state = createState();

function render() {
    renderTodoList(elements.todoList, state.todos, state.currentFilter, state.editingId, {
        onDelete: handleDeleteTodo,
        onEditCancel: handleCancelEdit,
        onEditSave: handleEditSave,
    });

    updateStats(elements.itemsLeft, state.todos);
    updateFilterButtons(elements.filters, state.currentFilter);
}

function syncState() {
    saveTodos(state.todos);
    saveTodosToApi(state.todos);
}

function handleAddTodo(text) {
    const safeText = sanitizeText(text);

    if (!safeText) {
        return;
    }

    addTodo(state, {
        id: createId(),
        text: safeText,
        completed: false,
    });

    syncState();
    render();
}

function handleToggleTodo(id) {
    toggleTodo(state, id);
    syncState();
    render();
}

function handleDeleteTodo(id) {
    deleteTodo(state, id);
    syncState();
    render();
}

function handleClearCompleted() {
    clearCompletedTodos(state);
    syncState();
    render();
}

function handleFilterChange(filter) {
    setCurrentFilter(state, filter);
    render();
}

function handleStartEdit(id) {
    setEditingId(state, id);
    render();
}

function handleCancelEdit() {
    setEditingId(state, null);
    render();
}

function handleEditSave(id, value) {
    const safeText = sanitizeText(value);

    if (!safeText) {
        handleCancelEdit();
        return;
    }

    state.todos = state.todos.map((todo) => {
        if (todo.id === id) {
            return {
                ...todo,
                text: safeText,
            };
        }

        return todo;
    });

    setEditingId(state, null);
    syncState();
    render();
}

function bindEvents() {
    elements.form?.addEventListener("submit", (event) => {
        event.preventDefault();
        handleAddTodo(elements.input.value);
        elements.input.value = "";
        elements.input.focus();
    });

    elements.todoList?.addEventListener("click", (event) => {
        const item = event.target.closest(".todo-item");

        if (!item) {
            return;
        }

        if (event.target.classList.contains("delete-btn") || event.target.closest(".delete-btn")) {
            event.stopPropagation();
            handleDeleteTodo(Number(item.dataset.id));
            return;
        }

        if (event.target.classList.contains("edit-input")) {
            return;
        }

        handleToggleTodo(Number(item.dataset.id));
    });

    elements.todoList?.addEventListener("dblclick", (event) => {
        const item = event.target.closest(".todo-item");

        if (item && !event.target.closest(".delete-btn")) {
            handleStartEdit(Number(item.dataset.id));
        }
    });

    elements.clearCompletedBtn?.addEventListener("click", handleClearCompleted);

    elements.filters.forEach((button) => {
        button.addEventListener("click", () => {
            handleFilterChange(button.dataset.filter);
        });
    });
}

async function initialize() {
    const storedTodos = loadTodos();
    setTodos(state, storedTodos);

    const remoteTodos = await fetchTodosFromApi();

    if (Array.isArray(remoteTodos) && remoteTodos.length > 0) {
        setTodos(state, remoteTodos);
        saveTodos(state.todos);
    }

    render();
    bindEvents();
}

const elements = getElements();

document.addEventListener("DOMContentLoaded", initialize);

window.todoApp = {
    state,
    render,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleClearCompleted,
    handleFilterChange,
};
