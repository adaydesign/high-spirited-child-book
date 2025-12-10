import { useState, useEffect } from 'react';
import { doc, getDoc, runTransaction, increment } from 'firebase/firestore';
import { db } from '../firebase';

// Get document ID for Firestore
const getDocId = (chapterId) => `chapter-${chapterId}`;
const getUserRatingKey = (chapterId) => `user-rating-${chapterId}`;

export default function ChapterRating({ chapterId, chapterTitle }) {
    const [rating, setRating] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [views, setViews] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [hasRated, setHasRated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const docId = getDocId(chapterId);
        const userRatingKey = getUserRatingKey(chapterId);

        const loadDataAndIncrementViews = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const docRef = doc(db, 'chapters', docId);

                // Increment view count using transaction
                await runTransaction(db, async (transaction) => {
                    const docSnap = await transaction.get(docRef);
                    if (docSnap.exists()) {
                        transaction.update(docRef, {
                            views: increment(1)
                        });
                    } else {
                        // Create new document if it doesn't exist
                        transaction.set(docRef, {
                            views: 1,
                            totalScore: 0,
                            totalRatings: 0,
                            averageRating: 0,
                            chapterTitle: chapterTitle || chapterId
                        });
                    }
                });

                // Get updated data
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setViews(data.views || 0);
                    setRating(data.averageRating || 0);
                    setTotalRatings(data.totalRatings || 0);
                }

                // Check if user already rated (stored in localStorage)
                const savedUserRating = localStorage.getItem(userRatingKey);
                if (savedUserRating) {
                    setUserRating(parseInt(savedUserRating, 10));
                    setHasRated(true);
                }
            } catch (err) {
                console.error('Error loading data from Firebase:', err);
                setError('ไม่สามารถโหลดข้อมูลได้');

                // Fallback to localStorage if Firebase fails
                const viewKey = `book-views-${chapterId}`;
                const currentViews = parseInt(localStorage.getItem(viewKey) || '0', 10) + 1;
                localStorage.setItem(viewKey, currentViews.toString());
                setViews(currentViews);
            } finally {
                setIsLoading(false);
            }
        };

        loadDataAndIncrementViews();
    }, [chapterId, chapterTitle]);

    const handleRate = async (newRating) => {
        if (hasRated) return;

        const docId = getDocId(chapterId);
        const userRatingKey = getUserRatingKey(chapterId);

        try {
            const docRef = doc(db, 'chapters', docId);

            await runTransaction(db, async (transaction) => {
                const docSnap = await transaction.get(docRef);
                const data = docSnap.exists() ? docSnap.data() : { totalScore: 0, totalRatings: 0 };

                const newTotalScore = (data.totalScore || 0) + newRating;
                const newTotalRatings = (data.totalRatings || 0) + 1;
                const newAverageRating = newTotalScore / newTotalRatings;

                if (docSnap.exists()) {
                    transaction.update(docRef, {
                        totalScore: newTotalScore,
                        totalRatings: newTotalRatings,
                        averageRating: newAverageRating
                    });
                } else {
                    transaction.set(docRef, {
                        views: 1,
                        totalScore: newTotalScore,
                        totalRatings: newTotalRatings,
                        averageRating: newAverageRating,
                        chapterTitle: chapterTitle || chapterId
                    });
                }

                setRating(newAverageRating);
                setTotalRatings(newTotalRatings);
            });

            // Save user rating locally to prevent duplicate ratings
            localStorage.setItem(userRatingKey, newRating.toString());
            setUserRating(newRating);
            setHasRated(true);
        } catch (err) {
            console.error('Error saving rating to Firebase:', err);
            setError('ไม่สามารถบันทึกคะแนนได้');
        }
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

    if (isLoading) {
        return (
            <div className="chapter-rating">
                <div className="rating-loading">กำลังโหลด...</div>
            </div>
        );
    }

    return (
        <div className="chapter-rating">
            {error && <div className="rating-error">{error}</div>}

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
