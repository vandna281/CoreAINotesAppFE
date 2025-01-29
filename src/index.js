import React from 'react';
import ReactDOM from 'react-dom/client';  // Correct import for React 18

import App from './App';

// Create a root element and render your app
const root = ReactDOM.createRoot(document.getElementById('root')); // Create root

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
