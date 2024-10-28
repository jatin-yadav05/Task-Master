import { createContext, useContext } from "react";

export const TodoContext = createContext({
    todos: [],
    addTodo: (todo) => {},
    deleteTodo: (id) => {},
    updateTodo: (todo, id) => {},
    toggleComplete: (id) => {},
    undoDelete: (todo) => {},  // Changed to accept todo object
    deletedTodos: []
})

export const TodoProvider = TodoContext.Provider

export const useTodo = () => {
    return useContext(TodoContext)
}
