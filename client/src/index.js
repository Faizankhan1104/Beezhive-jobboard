import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './Context/Auth';
import { SearchProvider } from './Context/Search';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <SearchProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SearchProvider>
  </AuthProvider>
);
