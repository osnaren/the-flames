import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#FFF8F5',
          border: '1px solid #FFEFEA',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          borderRadius: '8px',
          padding: '16px',
        },
        success: {
          style: {
            border: '1px solid #EAFFEF',
            background: '#F5FFF8',
          },
          iconTheme: {
            primary: '#22C55E',
            secondary: '#FFFFFF',
          },
        },
        error: {
          style: {
            border: '1px solid #FFEAEA',
            background: '#FFF5F5',
          },
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FFFFFF',
          },
        },
      }} />
      <App />
    </BrowserRouter>
  </StrictMode>
);