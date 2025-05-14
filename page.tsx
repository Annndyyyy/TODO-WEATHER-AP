'use client';

import { useState } from 'react';
import TodoSection from './components/TodoSection';
import NotesSection from './components/NotesSection';
import WeatherWidget from './components/WeatherWidget';
import Header from './components/Header';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'notes' | 'todos'>('notes');

  return (
    <main className="flex min-h-screen flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Weather Widget (Takes 1 column on mobile, 1 column on desktop) */}
          <div className="md:col-span-1">
            <WeatherWidget />
          </div>

          {/* Notes/Todo Section (Takes full width on mobile, 3 columns on desktop) */}
          <div className="md:col-span-3">
            {activeTab === 'notes' ? <NotesSection /> : <TodoSection />}
          </div>
        </div>
      </div>
    </main>
  );
} 