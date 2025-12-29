/**
 * Application Configuration
 * 
 * This file exports configuration values for the application.
 * Environment variables can be accessed using import.meta.env in Vite.
 */

export const config = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  
  // App Configuration
  appName: 'Library Management System',
  appVersion: '1.0.0',
  
  // Feature Flags
  features: {
    enableDarkMode: true,
    enableNotifications: true,
  },
  
  // Pagination
  defaultPageSize: 20,
  
  // Add more configuration as needed
} as const;

export default config;

