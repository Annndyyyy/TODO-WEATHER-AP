'use client';

import { useState, useEffect } from 'react';
import { useTodos, Todo } from '../contexts/TodoContext';

export default function TodoSection() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodoCompleted } = useTodos();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [newTodo, setNewTodo] = useState<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    completed: false,
    dueDate: null,
    duration: null,
  });
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [todosWithTimers, setTodosWithTimers] = useState<Record<string, { 
    timeLeft: number | null,
    intervalId: NodeJS.Timeout | null
  }>>({});

  
  const filteredTodos = todos.filter(
    (todo) => todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  useEffect(() => {
    
    return () => {
      Object.values(todosWithTimers).forEach(timer => {
        if (timer.intervalId) {
          clearInterval(timer.intervalId);
        }
      });
    };
  }, []);

 
  useEffect(() => {
    
    const now = new Date();
    
    
    todos.forEach(todo => {
      
      if (todo.completed) {
        return;
      }
      
      
      if (todosWithTimers[todo.id]?.intervalId) {
        return;
      }
      
      
      if (todo.duration) {
        let timeLeft = null;
        
        if (todo.dueDate) {
          
          const dueDate = new Date(todo.dueDate);
          const timeDiff = dueDate.getTime() - now.getTime();
          
          
          timeLeft = Math.max(0, Math.floor(timeDiff / 1000));
        } else if (todo.duration) {
          
          timeLeft = todo.duration * 60;
        }
        
        if (timeLeft !== null && timeLeft > 0) {
          
          const intervalId = setInterval(() => {
            setTodosWithTimers(prev => {
              const currentTimer = prev[todo.id];
              
              if (!currentTimer || currentTimer.timeLeft === null) {
                return prev;
              }
              
              
              const newTimeLeft = currentTimer.timeLeft - 1;
              
              
              if (newTimeLeft <= 0) {
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification('Todo Timer Complete', {
                    body: `Time's up for "${todo.title}"!`,
                    icon: '/notification-icon.png'
                  });
                }
                
                
                if (currentTimer.intervalId) {
                  clearInterval(currentTimer.intervalId);
                }
                
                return {
                  ...prev,
                  [todo.id]: { 
                    timeLeft: 0, 
                    intervalId: null 
                  }
                };
              }
              
              return {
                ...prev,
                [todo.id]: { 
                  ...currentTimer, 
                  timeLeft: newTimeLeft 
                }
              };
            });
          }, 1000);
          
          
          setTodosWithTimers(prev => ({
            ...prev,
            [todo.id]: { 
              timeLeft, 
              intervalId 
            }
          }));
        }
      }
    });
  }, [todos]);

  
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddTodo = () => {
    if (newTodo.title.trim() === '') return;
    
    addTodo({
      ...newTodo,
      
      duration: newTodo.duration,
    });
    
    setNewTodo({
      title: '',
      completed: false,
      dueDate: null,
      duration: null,
    });
    
    setShowAddTodo(false);
  };

  const handleUpdateTodo = () => {
    if (!editingTodo) return;
    
    updateTodo(editingTodo.id, {
      title: editingTodo.title,
      dueDate: editingTodo.dueDate,
      duration: editingTodo.duration,
    });
    
    setEditingTodo(null);
  };

  
  const handleDurationChange = (minutes: number | null) => {
    if (editingTodo) {
      setEditingTodo({
        ...editingTodo,
        duration: minutes,
      });
    } else {
      setNewTodo({
        ...newTodo,
        duration: minutes,
      });
    }
  };

 
  const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Tasks</h2>
        <button
          onClick={() => setShowAddTodo(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Add Task
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input
          type="search"
          className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Add Todo Form */}
      {showAddTodo && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="space-y-4">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Task title"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  min={new Date().toISOString().split('T')[0]}
                  defaultValue={getTomorrowDateString()}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    setNewTodo({
                      ...newTodo,
                      dueDate: date ? date.toISOString() : null,
                    });
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  placeholder="Duration in minutes"
                  min={1}
                  value={newTodo.duration || ''}
                  onChange={(e) => handleDurationChange(e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setShowAddTodo(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                onClick={handleAddTodo}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Todo Form */}
      {editingTodo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Task</h3>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="Task title"
                value={editingTodo.title}
                onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    min={new Date().toISOString().split('T')[0]}
                    defaultValue={editingTodo.dueDate ? new Date(editingTodo.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null;
                      setEditingTodo({
                        ...editingTodo,
                        dueDate: date ? date.toISOString() : null,
                      });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    placeholder="Duration in minutes"
                    min={1}
                    value={editingTodo.duration || ''}
                    onChange={(e) => handleDurationChange(e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setEditingTodo(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  onClick={handleUpdateTodo}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Todos List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
        {filteredTodos.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            {searchQuery ? 'No tasks match your search.' : 'No tasks yet. Add your first task!'}
          </p>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-item p-4 ${todo.completed ? 'bg-gray-50 dark:bg-gray-900' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <input
                    id={`todo-${todo.id}`}
                    type="checkbox"
                    className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                    checked={todo.completed}
                    onChange={() => toggleTodoCompleted(todo.id)}
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`ml-3 block text-gray-900 dark:text-white ${
                      todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                    }`}
                  >
                    {todo.title}
                  </label>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Timer Display */}
                  {todo.duration && !todo.completed && (
                    <div className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {formatTime(todosWithTimers[todo.id]?.timeLeft || null)}
                    </div>
                  )}
                  
                  {/* Due Date */}
                  {todo.dueDate && (
                    <div className={`text-xs ${
                      new Date(todo.dueDate) < new Date() && !todo.completed 
                        ? 'text-red-500 dark:text-red-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {new Date(todo.dueDate).toLocaleDateString()}
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setEditingTodo(todo)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      aria-label="Edit task"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                      aria-label="Delete task"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 
