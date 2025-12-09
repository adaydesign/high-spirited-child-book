import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import ThemeToggle from './components/ThemeToggle';
import PDFDownload from './components/PDFDownload';
import BookCover from './components/BookCover';
import ChapterReader from './components/ChapterReader';
import './styles/index.css';

function Header({ onMenuToggle }) {
  return (
    <header className="header">
      <div className="header-content">
        <button className="menu-toggle" onClick={onMenuToggle}>
          ☰ <span>สารบัญ</span>
        </button>

        <Link to="/" className="logo">
          <span className="logo-icon">📖</span>
          <span>อย่ากลัวเด็กดื้อ!</span>
        </Link>

        <div className="header-actions">
          <ThemeToggle />
          <PDFDownload />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>📚 อย่ากลัวเด็กดื้อ! เข้าใจลูกน้อยพลังงานสูง</p>
      <p>© {new Date().getFullYear()} สงวนลิขสิทธิ์ • เขียนด้วย ❤️ เพื่อผู้ปกครองทุกท่าน</p>
    </footer>
  );
}

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Check if we're on the cover page
  const isCoverPage = location.pathname === '/';

  return (
    <div className="app-container">
      <Header onMenuToggle={toggleMenu} />

      <Navigation isOpen={isMenuOpen} onClose={closeMenu} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<BookCover />} />
          <Route path="/preface" element={<ChapterReader />} />
          <Route path="/toc" element={<ChapterReader />} />
          <Route path="/introduction" element={<ChapterReader />} />
          <Route path="/chapter/:id" element={<ChapterReader />} />
          <Route path="/conclusion" element={<ChapterReader />} />
          <Route path="/references" element={<ChapterReader />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
