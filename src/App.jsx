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
          <a
            href="https://github.com/adaydesign/high-spirited-child-book"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
            title="View on GitHub"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
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
