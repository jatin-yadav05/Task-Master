import React, { useState } from 'react'
import { useTodo } from '../src/context/TodoContext'
import { PlusCircle } from 'lucide-react'

function TodoForm() {
  const [todo, setTodo] = useState("")
  const { addTodo } = useTodo()

  const add = (e) => {
    e.preventDefault()
    if (!todo) return
    addTodo({ todo, completed: false })
    setTodo("")
  }

  return (
    <form onSubmit={add} className="relative">
      <div className="relative group">
        <input
          type="text"
          placeholder="Add a new task..."
          className="w-full px-6 py-4 text-base rounded-2xl
                     bg-gray-50 dark:bg-gray-900/50
                     border-2 border-gray-300 dark:border-gray-700
                     text-gray-900 dark:text-gray-100
                     placeholder:text-gray-500 dark:placeholder:text-gray-500
                     focus:outline-none 
                     ring-offset-0
                     focus:ring-0
                     transition-colors duration-200 ease-in-out
                     shadow-sm hover:border-blue-400 dark:hover:border-gray-600
                     focus:border-blue-600 dark:focus:border-blue-400"
          value={todo}
          onChange={e => setTodo(e.target.value)}
        />
        <button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2
                     px-4 py-2 rounded-xl
                     bg-gradient-to-r from-blue-600 to-indigo-600 
                     hover:from-blue-700 hover:to-indigo-700
                     dark:from-blue-600 dark:to-indigo-600
                     dark:hover:from-blue-500 dark:hover:to-indigo-500
                     text-white font-medium
                     transition-all duration-200 ease-in-out
                     transform hover:scale-105 active:scale-95
                     flex items-center gap-2
                     shadow-lg shadow-blue-500/25 dark:shadow-blue-600/25"
        >
          <PlusCircle size={20} />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>
    </form>
  )
}

export default TodoForm
