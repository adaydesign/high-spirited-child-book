import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chapters } from './Navigation';
import SocialShare from './SocialShare';
import ChapterRating from './ChapterRating';

// Import all markdown files
import coverMd from '../content/cover.md?raw';
import prefaceMd from '../content/preface.md?raw';
import tocMd from '../content/toc.md?raw';
import introMd from '../content/introduction.md?raw';
import chapter1Md from '../content/chapter1.md?raw';
import chapter2Md from '../content/chapter2.md?raw';
import chapter3Md from '../content/chapter3.md?raw';
import chapter4Md from '../content/chapter4.md?raw';
import chapter5Md from '../content/chapter5.md?raw';
import conclusionMd from '../content/conclusion.md?raw';
import referencesMd from '../content/references.md?raw';

const contentMap = {
    '/': coverMd,
    '/preface': prefaceMd,
    '/toc': tocMd,
    '/introduction': introMd,
    '/chapter/1': chapter1Md,
    '/chapter/2': chapter2Md,
    '/chapter/3': chapter3Md,
    '/chapter/4': chapter4Md,
    '/chapter/5': chapter5Md,
    '/conclusion': conclusionMd,
    '/references': referencesMd,
};

// Pages that should show rating
const rateablePages = ['/introduction', '/chapter/1', '/chapter/2', '/chapter/3', '/chapter/4', '/chapter/5', '/conclusion'];

export default function ChapterReader() {
    const location = useLocation();
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const markdown = contentMap[location.pathname] || '# ไม่พบเนื้อหา';
        setContent(markdown);
        setIsLoading(false);

        // Scroll to top when changing chapters
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Find current index for navigation
    const currentIndex = chapters.findIndex(ch => ch.path === location.pathname);
    const currentChapter = chapters[currentIndex];
    const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

    // Check if this page should show rating
    const showRating = rateablePages.includes(location.pathname);

    // Get chapter ID for rating
    const chapterId = location.pathname.replace(/\//g, '-').replace(/^-/, '') || 'home';

    if (isLoading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <article className="chapter-content">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Custom rendering for links
                    a: ({ node, ...props }) => {
                        if (props.href?.startsWith('/')) {
                            return <Link to={props.href}>{props.children}</Link>;
                        }
                        return <a {...props} target="_blank" rel="noopener noreferrer" />;
                    },
                    // Custom table wrapper for responsive
                    table: ({ node, ...props }) => (
                        <div style={{ overflowX: 'auto' }}>
                            <table {...props} />
                        </div>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>

            {/* Social Share */}
            <div className="chapter-footer">
                <SocialShare title={currentChapter?.label} />

                {/* Rating Section */}
                {showRating && (
                    <ChapterRating
                        chapterId={chapterId}
                        chapterTitle={currentChapter?.label}
                    />
                )}
            </div>

            {/* Chapter Navigation */}
            <nav className="chapter-nav">
                {prevChapter ? (
                    <Link
                        to={prevChapter.path}
                        className="chapter-nav-btn"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                    >
                        <span className="chapter-nav-label">← ก่อนหน้า</span>
                        <span className="chapter-nav-title">{prevChapter.label}</span>
                    </Link>
                ) : (
                    <div />
                )}

                {nextChapter && (
                    <Link
                        to={nextChapter.path}
                        className="chapter-nav-btn"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                    >
                        <span className="chapter-nav-label">ถัดไป →</span>
                        <span className="chapter-nav-title">{nextChapter.label}</span>
                    </Link>
                )}
            </nav>
        </article>
    );
}

