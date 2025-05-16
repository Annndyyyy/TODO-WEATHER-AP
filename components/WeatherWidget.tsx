'use client';

import { useState, useEffect } from 'react';

type WeatherData = {
  location: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
};

export default function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // First, get the user's location
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              

              const API_KEY = 'd54fe5abcacb10cf0c5122f0fa3d66dc'; // API key provided by user
              const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
              );
              
              if (!response.ok) {
                throw new Error('Failed to fetch weather data');
              }
              
              const data = await response.json();
              
              setWeatherData({
                location: data.name,
                temperature: Math.round(data.main.temp),
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
              });
              
              setLoading(false);
            },
            (err) => {
              setError('Unable to get location: ' + err.message);
              setLoading(false);
            }
          );
        } else {
          setError('Geolocation is not supported by your browser');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to fetch weather data');
        setLoading(false);
      }
    };

    // For development purposes, use mock data to avoid API calls
    const useMockData = false; // Set to false to use real API
    
    if (useMockData) {
      // Mock weather data for development
      setTimeout(() => {
        setWeatherData({
          location: 'New York',
          temperature: 22,
          description: 'Partly cloudy',
          icon: '02d',
          humidity: 65,
          windSpeed: 5.2,
        });
        setLoading(false);
      }, 1000);
    } else {
      fetchWeatherData();
    }
  }, []);

  // Function to get the weather icon URL
  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md animate-pulse h-48">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Weather</h2>
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Please check your connection or allow location access to see weather information.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Weather</h2>
      
      {weatherData && (
        <div>
          <div className="flex items-center mb-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {weatherData.temperature}°C
            </span>
            {weatherData.icon && (
              <img 
                src={getWeatherIconUrl(weatherData.icon)} 
                alt={weatherData.description}
                className="w-12 h-12 ml-2"
              />
            )}
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 capitalize mb-2">
            {weatherData.description}
          </p>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
            {weatherData.location}
          </p>
          
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <span className="block">Humidity</span>
              <span className="font-medium">{weatherData.humidity}%</span>
            </div>
            <div>
              <span className="block">Wind</span>
              <span className="font-medium">{weatherData.windSpeed} m/s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
