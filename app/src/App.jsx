import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import Playground from './pages/Playground';
import Docs from './pages/Docs';
import Business from './pages/Business';
import NotFound from './pages/NotFound';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/business" element={<Business />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
