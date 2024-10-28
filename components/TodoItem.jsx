import { useState } from 'react'
import { useTodo } from '../src/context/TodoContext'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Pencil, Trash2, GripVertical, Check, X } from 'lucide-react'

function TodoItem({ todo, id }) {
  const { updateTodo, deleteTodo, toggleComplete } = useTodo()
  const [isTodoEditable, setIsTodoEditable] = useState(false)
  const [todoMsg, setTodoMsg] = useState(todo.todo)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1
  }

  const editTodo = () => {
    updateTodo(todo.id, { ...todo, todo: todoMsg })
    setIsTodoEditable(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-center gap-4 p-4 
                  ${todo.completed 
                    ? 'bg-gray-100 dark:bg-gray-800/50' 
                    : 'bg-white dark:bg-gray-800/80'} 
                  rounded-xl border
                  ${todo.completed
                    ? 'border-gray-300 dark:border-gray-700'
                    : 'border-gray-300 dark:border-gray-700'}
                  transition-all duration-300 ease-in-out
                  hover:shadow-lg hover:scale-[1.02]
                  hover:border-blue-300 dark:hover:border-blue-800
                  ${isDragging ? 'rotate-2 scale-105 shadow-xl' : ''}
                  shadow-sm`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-move text-gray-500 hover:text-gray-700 
                   dark:text-gray-600 dark:hover:text-gray-400
                   transition-colors duration-200"
      >
        <GripVertical size={20} />
      </div>

      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleComplete(todo.id)}
        className="w-5 h-5 rounded-lg
                   border-2 border-gray-400 dark:border-gray-600 
                   checked:bg-gradient-to-r checked:from-green-500 checked:to-green-600
                   checked:border-transparent cursor-pointer
                   transition-all duration-200 ease-in-out"
      />

      <div className="flex-1">
        {isTodoEditable ? (
          <input
            type="text"
            value={todoMsg}
            onChange={(e) => setTodoMsg(e.target.value)}
            className="w-full bg-transparent outline-none 
                       border-b-2 border-blue-600 
                       text-gray-900 dark:text-gray-100
                       focus:border-blue-700 dark:focus:border-blue-400
                       transition-all duration-200"
          />
        ) : (
          <span className={`text-base ${todo.completed 
            ? 'line-through text-gray-500 dark:text-gray-500' 
            : 'text-gray-900 dark:text-gray-100'}`}>
            {todo.todo}
          </span>
        )}
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
        {isTodoEditable ? (
          <>
            <button
              onClick={editTodo}
              className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 
                         text-green-600 dark:text-green-400
                         transition-all duration-200"
            >
              <Check size={18} />
            </button>
            <button
              onClick={() => {
                setTodoMsg(todo.todo)
                setIsTodoEditable(false)
              }}
              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 
                         text-red-600 dark:text-red-400
                         transition-all duration-200"
            >
              <X size={18} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsTodoEditable(true)}
              disabled={todo.completed}
              className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 
                         text-blue-600 dark:text-blue-400
                         disabled:opacity-30 disabled:cursor-not-allowed
                         transition-all duration-200"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 
                         text-red-600 dark:text-red-400
                         transition-all duration-200"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default TodoItem
