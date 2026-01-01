import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import Playground from './pages/Playground';
import Docs from './pages/Docs';
import Business from './pages/Business';
import Marketplace from './pages/Marketplace';
import NotFound from './pages/NotFound';
import './styles/global.css';

// Google Analytics page tracking for SPA
function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-7G0EZG70SP', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
}

function AppContent() {
  usePageTracking();

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/business" element={<Business />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
