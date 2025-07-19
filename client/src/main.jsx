import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext.jsx';
import { AnimatePresence } from 'framer-motion';

createRoot(document.getElementById('root')).render(
  <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white text-gray-700 font-[Inter] transition-all duration-500 ease-in-out">
    <BrowserRouter>
      <AppContextProvider>
        <AnimatePresence mode="wait">
          <App />
        </AnimatePresence>
      </AppContextProvider>
    </BrowserRouter>
  </div>
);
