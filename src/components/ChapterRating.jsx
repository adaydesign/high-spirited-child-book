import { useState, useEffect } from 'react';

// Simple localStorage-based rating system
// For production, you'd want to use a backend service like Firebase

const getStorageKey = (chapterId) => `book-rating-${chapterId}`;
const getViewKey = (chapterId) => `book-views-${chapterId}`;

export default function ChapterRating({ chapterId, chapterTitle }) {
    const [rating, setRating] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [views, setViews] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [hasRated, setHasRated] = useState(false);

    useEffect(() => {
        // Load existing data from localStorage
        const storageKey = getStorageKey(chapterId);
        const viewKey = getViewKey(chapterId);

        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
            const data = JSON.parse(savedData);
            setRating(data.averageRating || 0);
            setTotalRatings(data.totalRatings || 0);
            setUserRating(data.userRating || 0);
            setHasRated(data.userRating > 0);
        }

        // Increment view count
        const currentViews = parseInt(localStorage.getItem(viewKey) || '0', 10) + 1;
        localStorage.setItem(viewKey, currentViews.toString());
        setViews(currentViews);
    }, [chapterId]);

    const handleRate = (newRating) => {
        if (hasRated) return;

        const storageKey = getStorageKey(chapterId);
        const savedData = localStorage.getItem(storageKey);
        const data = savedData ? JSON.parse(savedData) : { totalScore: 0, totalRatings: 0 };

        const newTotalRatings = data.totalRatings + 1;
        const newTotalScore = (data.totalScore || data.averageRating * data.totalRatings || 0) + newRating;
        const newAverageRating = newTotalScore / newTotalRatings;

        const newData = {
            totalScore: newTotalScore,
            totalRatings: newTotalRatings,
            averageRating: newAverageRating,
            userRating: newRating
        };

        localStorage.setItem(storageKey, JSON.stringify(newData));

        setRating(newAverageRating);
        setUserRating(newRating);
        setTotalRatings(newTotalRatings);
        setHasRated(true);
    };

    const renderStars = (value, interactive = false) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const filled = i <= (interactive ? (hoveredStar || userRating) : Math.round(value));
            stars.push(
                <button
                    key={i}
                    className={`star ${filled ? 'filled' : ''} ${interactive && !hasRated ? 'interactive' : ''}`}
                    onClick={() => interactive && !hasRated && handleRate(i)}
                    onMouseEnter={() => interactive && !hasRated && setHoveredStar(i)}
                    onMouseLeave={() => interactive && setHoveredStar(0)}
                    disabled={!interactive || hasRated}
                    title={interactive ? (hasRated ? 'คุณให้คะแนนแล้ว' : `ให้ ${i} ดาว`) : ''}
                >
                    ★
                </button>
            );
        }
        return stars;
    };

    return (
        <div className="chapter-rating">
            <div className="rating-stats">
                <div className="views-count">
                    <span className="icon">👁️</span>
                    <span>{views.toLocaleString()} ครั้ง</span>
                </div>

                <div className="rating-display">
                    <div className="stars-display">
                        {renderStars(rating)}
                    </div>
                    <span className="rating-text">
                        {rating > 0 ? rating.toFixed(1) : '-'} ({totalRatings} รีวิว)
                    </span>
                </div>
            </div>

            <div className="rate-this">
                <span className="rate-label">
                    {hasRated ? '✓ ขอบคุณที่ให้คะแนน!' : 'ให้คะแนนบทนี้:'}
                </span>
                <div className="user-rating">
                    {renderStars(userRating, true)}
                </div>
            </div>
        </div>
    );
}
