'use client';

import { useState } from 'react';
import { useNotes, Note } from '../contexts/NotesContext';

export default function NotesSection() {
  const { notes, addNote, updateNote, deleteNote, toggleNoteCompleted } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    color: 'blue',
    completed: false,
  });
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Filter notes based on search query
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNote = () => {
    if (newNote.title.trim() === '') return;
    
    addNote(newNote);
    setNewNote({
      title: '',
      content: '',
      color: 'blue',
      completed: false,
    });
    setShowAddNote(false);
  };

  const handleUpdateNote = () => {
    if (!editingNote) return;
    
    updateNote(editingNote.id, {
      title: editingNote.title,
      content: editingNote.content,
      color: editingNote.color,
    });
    
    setEditingNote(null);
  };

  const colorOptions = [
    { id: 'blue', bg: 'bg-blue-500' },
    { id: 'green', bg: 'bg-green-500' },
    { id: 'yellow', bg: 'bg-yellow-500' },
    { id: 'red', bg: 'bg-red-500' },
    { id: 'purple', bg: 'bg-purple-500' },
  ];

  const getColorClass = (color: string) => {
    const colorOption = colorOptions.find(opt => opt.id === color);
    return colorOption ? colorOption.bg : 'bg-blue-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Notes</h2>
        <button
          onClick={() => setShowAddNote(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Add Note
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
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Add Note Form */}
      {showAddNote && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="space-y-4">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Content"
              rows={4}
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            />
            
            <div className="flex space-x-2">
              {colorOptions.map((option) => (
                <button
                  key={option.id}
                  className={`w-6 h-6 rounded-full ${option.bg} ${
                    newNote.color === option.id ? 'ring-2 ring-offset-2 ring-primary-500' : ''
                  }`}
                  onClick={() => setNewNote({ ...newNote, color: option.id })}
                  aria-label={`Set color to ${option.id}`}
                />
              ))}
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setShowAddNote(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                onClick={handleAddNote}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Note Form */}
      {editingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Note</h3>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="Title"
                value={editingNote.title}
                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
              />
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="Content"
                rows={6}
                value={editingNote.content}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
              />
              
              <div className="flex space-x-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`w-6 h-6 rounded-full ${option.bg} ${
                      editingNote.color === option.id ? 'ring-2 ring-offset-2 ring-primary-500' : ''
                    }`}
                    onClick={() => setEditingNote({ ...editingNote, color: option.id })}
                    aria-label={`Set color to ${option.id}`}
                  />
                ))}
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setEditingNote(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  onClick={handleUpdateNote}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
            {searchQuery ? 'No notes match your search.' : 'No notes yet. Create your first note!'}
          </p>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`note-card relative bg-white dark:bg-gray-800 ${
                note.completed ? 'opacity-70' : ''
              }`}
            >
              <div className={`note-color-tag ${getColorClass(note.color)}`}></div>
              <div className="pt-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {note.title}
                  </h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setEditingNote(note)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      aria-label="Edit note"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                      aria-label="Delete note"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-2 whitespace-pre-line text-gray-800 dark:text-gray-300">
                  {note.content}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div>
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={note.completed}
                      onChange={() => toggleNoteCompleted(note.id)}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-600 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                    <span className="ms-2">Completed</span>
                  </label>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 