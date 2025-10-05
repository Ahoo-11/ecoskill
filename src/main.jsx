import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/globals.css';
import App from './App.jsx';
import VeChainProvider from './lib/vechainProvider.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <VeChainProvider>
          <App />
        </VeChainProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
