'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
  duration: number | null; // in minutes
  createdAt: string;
  updatedAt: string;
};

type TodoContextType = {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTodo: (id: string) => void;
  toggleTodoCompleted: (id: string) => void;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const STORAGE_KEY = 'notes-app-todos';

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    } else {
      // Set demo todos if none exist
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const demoTodos: Todo[] = [
        {
          id: '1',
          title: 'Complete project',
          completed: false,
          dueDate: tomorrow.toISOString(),
          duration: 120, // 2 hours
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: '2',
          title: 'Go for a run',
          completed: false,
          dueDate: now.toISOString(),
          duration: 30, // 30 minutes
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      ];
      setTodos(demoTodos);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // Check for due todos and trigger notifications
  useEffect(() => {
    // Set up notifications if available
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    // Check todos due dates
    const checkDueTodos = () => {
      const now = new Date();
      todos.forEach(todo => {
        if (
          !todo.completed && 
          todo.dueDate && 
          new Date(todo.dueDate) <= now
        ) {
          // Show notification for overdue todos
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Todo Reminder', {
              body: `"${todo.title}" is now due!`,
              icon: '/notification-icon.png' // Add an icon to your public folder
            });
          }
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkDueTodos, 60000);
    return () => clearInterval(interval);
  }, [todos]);

  const addTodo = (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString();
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
  };

  const updateTodo = (
    id: string,
    updates: Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const toggleTodoCompleted = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              updatedAt: new Date().toISOString(),
            }
          : todo
      )
    );
  };

  return (
    <TodoContext.Provider
      value={{ todos, addTodo, updateTodo, deleteTodo, toggleTodoCompleted }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
} 