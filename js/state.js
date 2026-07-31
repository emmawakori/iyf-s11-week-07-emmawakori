const initialState = {
    todos: [],
    currentFilter: "all",
    editingId: null,
};

export function createState() {
    return {
        ...initialState,
        todos: [],
    };
}

export function setTodos(state, todos) {
    state.todos = todos;
}

export function addTodo(state, todo) {
    state.todos.unshift(todo);
}

export function toggleTodo(state, id) {
    state.todos = state.todos.map((todo) => {
        if (todo.id === id) {
            return {
                ...todo,
                completed: !todo.completed,
            };
        }

        return todo;
    });
}

export function deleteTodo(state, id) {
    state.todos = state.todos.filter((todo) => todo.id !== id);

    if (state.editingId === id) {
        state.editingId = null;
    }
}

export function clearCompletedTodos(state) {
    state.todos = state.todos.filter((todo) => !todo.completed);
    state.editingId = null;
}

export function setCurrentFilter(state, filter) {
    state.currentFilter = filter;
}

export function setEditingId(state, id) {
    state.editingId = id;
}

export function getFilteredTodos(state) {
    return state.todos.filter((todo) => {
        if (state.currentFilter === "active") {
            return !todo.completed;
        }

        if (state.currentFilter === "completed") {
            return todo.completed;
        }

        return true;
    });
}

export function getRemainingCount(state) {
    return state.todos.filter((todo) => !todo.completed).length;
}
