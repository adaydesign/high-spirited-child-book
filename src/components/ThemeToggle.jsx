import { useState, useEffect } from 'react';

const themes = [
    { id: 'light', label: '☀️', title: 'สว่าง' },
    { id: 'dark', label: '🌙', title: 'มืด' },
    { id: 'sepia', label: '📜', title: 'ซีเปีย' },
];

export default function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('book-theme');
        return saved || 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('book-theme', theme);
    }, [theme]);

    return (
        <div className="theme-toggle">
            {themes.map((t) => (
                <button
                    key={t.id}
                    className={`theme-btn ${theme === t.id ? 'active' : ''}`}
                    onClick={() => setTheme(t.id)}
                    title={t.title}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
}
