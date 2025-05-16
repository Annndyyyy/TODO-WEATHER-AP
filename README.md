# Notes & Todo App with Weather Integration

A feature-rich web application for managing notes and todos with real-time weather information.

## Features:

- **Notes System**
  - Create, edit, and delete notes
  - Checkbox functionality for completed notes
  - Color-tagging for organization
  - Search functionality

- **Todo List**
  - Create, edit, and delete tasks
  - Set due dates and durations
  - Timer functionality with notifications
  - Mark tasks as completed

- **Weather Integration**
  - Real-time weather data based on user's location
  - Display temperature, condition, and other weather information
  - Visual weather indicators

- **User Experience**
  - Dark/Light mode toggle
  - Responsive design for all devices
  - Offline support with local storage

## Tech Stack

- Next.js (React framework)
- TypeScript
- Tailwind CSS
- Context API for state management
- Local Storage for data persistence

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Annndyyyy/TODO-WEATHER-AP.git
cd todo-weather-app
```

2. Install the dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Project Structure

The project is organized into several branches, each focusing on a specific feature:

- `main` - Core application setup and shared components
- `feature/notes` - Notes functionality implementation
- `feature/todos` - Todo list with timer functionality
- `feature/weather` - Weather API integration
- `feature/ui-enhancements` - UI/UX improvements and dark mode

## Weather API Integration

To use the weather functionality with real data, you need to:

1. Get an API key from [OpenWeatherMap](https://openweathermap.org/api) or another weather service
2. Create a `.env.local` file in the project root
3. Add your API key: `NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here`

## License

This project is licensed under the MIT License.
