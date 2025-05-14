'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

type NotesContextType = {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteNote: (id: string) => void;
  toggleNoteCompleted: (id: string) => void;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

const STORAGE_KEY = 'notes-app-notes';

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      // Set demo notes if none exist
      const demoNotes: Note[] = [
        {
          id: '1',
          title: 'Welcome!',
          content: 'This is a note-taking app. You can create, edit, and delete notes.',
          color: 'blue',
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Shopping List',
          content: '- Eggs\n- Milk\n- Bread\n- Fruits',
          color: 'green',
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setNotes(demoNotes);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoNotes));
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString();
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  };

  const updateNote = (
    id: string,
    updates: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const toggleNoteCompleted = (id: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              completed: !note.completed,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );
  };

  return (
    <NotesContext.Provider
      value={{ notes, addNote, updateNote, deleteNote, toggleNoteCompleted }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
} 