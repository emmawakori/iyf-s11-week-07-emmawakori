export function getElements() {
    return {
        form: document.getElementById("todo-form"),
        input: document.getElementById("todo-input"),
        todoList: document.getElementById("todo-list"),
        itemsLeft: document.getElementById("items-left"),
        filters: Array.from(document.querySelectorAll(".filter")),
        clearCompletedBtn: document.getElementById("clear-completed"),
    };
}

export function renderTodoList(todoList, todos, currentFilter, editingId, handlers) {
    if (!todoList) {
        return;
    }

    todoList.innerHTML = "";

    const filteredTodos = todos.filter((todo) => {
        if (currentFilter === "active") {
            return !todo.completed;
        }

        if (currentFilter === "completed") {
            return todo.completed;
        }

        return true;
    });

    filteredTodos.forEach((todo) => {
        todoList.appendChild(createTodoElement(todo, editingId, handlers));
    });
}

export function createTodoElement(todo, editingId, handlers) {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.dataset.id = todo.id;

    if (todo.completed) {
        li.classList.add("completed");
    }

    if (editingId === todo.id) {
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = todo.text;
        editInput.className = "edit-input";

        editInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                handlers.onEditSave(todo.id, editInput.value);
            }

            if (event.key === "Escape") {
                handlers.onEditCancel();
            }
        });

        editInput.addEventListener("blur", () => {
            handlers.onEditSave(todo.id, editInput.value);
        });

        editInput.focus();
        editInput.select();
        li.appendChild(editInput);
    } else {
        const textSpan = document.createElement("span");
        textSpan.className = "todo-text";
        textSpan.textContent = todo.text;
        li.appendChild(textSpan);
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        handlers.onDelete(todo.id);
    });

    li.appendChild(deleteBtn);
    return li;
}

export function updateStats(itemsLeft, todos) {
    if (!itemsLeft) {
        return;
    }

    const remainingItems = todos.filter((todo) => !todo.completed).length;
    itemsLeft.textContent = `${remainingItems} item${remainingItems === 1 ? "" : "s"} left`;
}

export function updateFilterButtons(filters, currentFilter) {
    filters.forEach((button) => {
        button.classList.toggle("active", button.dataset.filter === currentFilter);
    });
}
