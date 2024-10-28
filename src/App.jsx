import { useEffect, useState } from 'react'
import { TodoProvider } from './context/TodoContext'
import { TodoForm, TodoItem } from '../components'
import { closestCorners, DndContext } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import ThemeToggle from '../components/ThemeToggle'
import { ThemeProvider } from './context/ThemeContext'
import { toast, Toaster } from 'react-hot-toast';
import { XCircle } from 'lucide-react'

function App() {
  const [todos, setTodos] = useState([])
  const [theme, setTheme] = useState('dark')
  const [deletedTodos, setDeletedTodos] = useState([])

  const addTodo = (todo) => {
    setTodos((prevTodos) => [{ id: Date.now(), ...todo }, ...prevTodos])
  }

  const updateTodo = (id, todo) => {
    setTodos((prev) => prev.map((eachTodo) => (eachTodo.id === id ? { ...eachTodo, ...todo } : eachTodo)))
  }
 
  const deleteTodo = (id) => {
    const todoToDelete = todos.find((todo) => todo.id === id);
    console.log('Found todo to delete:', todoToDelete);
    
    if (todoToDelete) {
      
      const todoForDeletion = {
        ...todoToDelete,
        timestamp: Date.now()
      };
      setDeletedTodos(prev => {
        console.log('Previous deletedTodos:', prev);
        const newDeletedTodos = [todoForDeletion, ...prev];
        console.log('Updated deletedTodos:', newDeletedTodos);
        return newDeletedTodos;
      });
      setTodos(prev => prev.filter(todo => todo.id !== id));
      showUndoToast(todoForDeletion);
    }
  }
  
  const showUndoToast = (deletedTodo) => {
    console.log('Showing toast for deleted todo:', deletedTodo);
    
    toast((t) => (
      <div className="flex items-center justify-between w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="flex items-center p-4">
          <div className="flex-shrink-0">
            <XCircle className="h-6 w-6 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Todo Deleted
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {deletedTodo.todo}
            </p>
          </div>
        </div>
        <div className="flex items-center p-4">
          <button
            onClick={() => {
              console.log('Undo clicked for todo:', deletedTodo);
              console.log('Current deletedTodos state:', deletedTodos);
              undoDelete(deletedTodo);  // Pass the entire todo object instead of just the ID
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 font-semibold bg-blue-100 dark:bg-blue-900 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
          >
            Undo
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'bottom-right',
    });
  }

  const undoDelete = (todoToRestore) => {  // Changed to accept the entire todo object
    console.log('Attempting to restore todo:', todoToRestore);
    
    if (todoToRestore) {
      const { timestamp, ...todoWithoutTimestamp } = todoToRestore;
      
      setTodos(prev => [todoWithoutTimestamp, ...prev]);
      setDeletedTodos(prev => prev.filter(todo => todo.id !== todoToRestore.id));
      
      toast.success('Todo restored successfully!', {
        duration: 2000,
        position: 'bottom-right',
        style: {
          color: theme === 'dark' ? 'white' : '#333333',
        },
      });
    }
  }

  const toggleComplete = (id) => {
    setTodos((prev) => prev.map((eachTodo) =>
      eachTodo.id === id
        ? { ...eachTodo, completed: !eachTodo.completed }
        : eachTodo
    ))
    console.log('this is deleted todo list',deletedTodos);
  }

  const getTaskPos = (id) => todos.findIndex(todo => todo.id === id)

  const handleDragEnd = (e) => {
    const { active, over } = e //
    if (!over) return

    setTodos((tasks) => {
      const originPos = getTaskPos(active.id)
      const newPos = getTaskPos(over.id)

      return arrayMove(tasks, originPos, newPos)
    })
  }

  const lightTheme = () => {
    setTheme('light');
  }
  const darkTheme = () => {
    setTheme('dark')
  }

  useEffect(() => {
    document.querySelector('html').classList.remove('dark', 'light')
    document.querySelector('html').classList.add(theme)
  }, [theme])

  useEffect(() => {
    console.log('Deleted todos updated:', deletedTodos);
  }, [deletedTodos]);
  
  useEffect(() => {
    console.log('Todos updated:', todos);
  }, [todos]);

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'))
    if (storedTodos && storedTodos.length > 0) {
      setTodos(storedTodos)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  return (
    <ThemeProvider value={{ theme, darkTheme, lightTheme }}>
      <TodoProvider value={{ todos, addTodo, deleteTodo, updateTodo, toggleComplete, undoDelete, deletedTodos }}>
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 
                        dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
          <div className='fixed top-4 right-4 z-10'>
            <ThemeToggle />
          </div>
          
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
              {/* Header Section */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 
                              dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent
                              mb-4">
                  Task Master
                </h1>
                <p className="text-gray-700 dark:text-gray-400 font-medium">
                  Organize your tasks, boost your productivity
                </p>
              </div>

              {/* Main Content Card */}
              <div className="backdrop-blur-lg bg-white/90 dark:bg-gray-800/80 
                             rounded-2xl shadow-2xl p-6 mb-8
                             border border-gray-300 dark:border-gray-700">
                
                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-blue-100 dark:bg-gray-700 rounded-xl p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                      {todos.length}
                    </p>
                    <p className="text-sm font-medium text-blue-600 dark:text-gray-400">Total Tasks</p>
                  </div>
                  <div className="bg-green-100 dark:bg-gray-700 rounded-xl p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                      {todos.filter(t => t.completed).length}
                    </p>
                    <p className="text-sm font-medium text-green-600 dark:text-gray-400">Completed</p>
                  </div>
                  <div className="bg-purple-100 dark:bg-gray-700 rounded-xl p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                      {todos.filter(t => !t.completed).length}
                    </p>
                    <p className="text-sm font-medium text-purple-600 dark:text-gray-400">Pending</p>
                  </div>
                </div>

                {/* Todo Form */}
                <div className="mb-8">
                  <TodoForm />
                </div>

                {/* Todo List */}
                <DndContext
                  onDragEnd={handleDragEnd}
                  collisionDetection={closestCorners}
                  activationConstraint={{ delay: 250, tolerance: 5 }}
                >
                  <div className="space-y-4">
                    <SortableContext items={todos} strategy={verticalListSortingStrategy}>
                      {todos.map((todo) => (
                        <div key={todo.id}>
                          <TodoItem todo={todo} id={todo.id} />
                        </div>
                      ))}
                    </SortableContext>
                  </div>
                </DndContext>

                {/* Empty State */}
                {todos.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      No tasks yet. Add your first task above!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Toaster toastOptions={{
          className: '',
          style: {
            background: 'transparent',
            padding: '0',
            boxShadow: 'none',
          },
        }} />
      </TodoProvider>
    </ThemeProvider>
  )
}

export default App
