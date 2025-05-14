import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotesProvider } from './contexts/NotesContext';
import { TodoProvider } from './contexts/TodoContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Notes & Todo App with Weather',
  description: 'A simple app for notes and todo lists with weather integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <NotesProvider>
            <TodoProvider>
              {children}
            </TodoProvider>
          </NotesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 