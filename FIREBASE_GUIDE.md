# คู่มือการใช้ Firebase สำหรับเก็บจำนวนผู้อ่านและคะแนน

## ทำไมต้อง Firebase?

Firebase เป็นบริการ Backend-as-a-Service ของ Google ที่เหมาะสำหรับเว็บไซต์ของคุณ:
- ✅ **ฟรี** สำหรับ usage ระดับเล็ก-กลาง (1GB storage, 50K reads/day)
- ✅ **ง่าย** ตั้งค่าได้ภายใน 10 นาที
- ✅ **Real-time** อัพเดทข้อมูลแบบ instant
- ✅ **No Backend** ไม่ต้องเขียน server code

---

## ขั้นตอนการติดตั้ง

### 1. สร้างโปรเจค Firebase

1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. คลิก "Add project" หรือ "สร้างโปรเจค"
3. ตั้งชื่อ เช่น "high-spirited-child-book"
4. ปิด Google Analytics (ไม่จำเป็น)
5. คลิก "Create project"

### 2. ตั้งค่า Firestore Database

1. ในเมนูซ้าย คลิก **Build > Firestore Database**
2. คลิก "Create database"
3. เลือก **Start in test mode** (สำหรับพัฒนา)
4. เลือก region ใกล้ที่สุด (asia-southeast1 สำหรับไทย)

### 3. เพิ่ม Firebase ใน Web App

1. ใน Project Overview คลิกไอคอน Web `</>`
2. ตั้งชื่อ app
3. Copy config object ที่ได้

---

## การติดตั้งใน React

### ติดตั้ง Package

```bash
npm install firebase
```

### สร้างไฟล์ Config

สร้างไฟล์ `src/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

> ⚠️ **ความปลอดภัย**: สำหรับ production ควรใช้ environment variables

---

## อัพเดท ChapterRating.jsx

อัพเดท component ให้ใช้ Firebase แทน localStorage:

```jsx
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, increment, runTransaction } from 'firebase/firestore';
import { db } from '../firebase';

const getDocId = (chapterId) => `chapter-${chapterId}`;

export default function ChapterRating({ chapterId, chapterTitle }) {
    const [rating, setRating] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [views, setViews] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [hasRated, setHasRated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const docId = getDocId(chapterId);
        const userRatingKey = `user-rating-${chapterId}`;
        
        const loadDataAndIncrementViews = async () => {
            setIsLoading(true);
            try {
                const docRef = doc(db, 'chapters', docId);
                
                // Increment view count
                await runTransaction(db, async (transaction) => {
                    const docSnap = await transaction.get(docRef);
                    if (docSnap.exists()) {
                        transaction.update(docRef, {
                            views: increment(1)
                        });
                    } else {
                        transaction.set(docRef, {
                            views: 1,
                            totalScore: 0,
                            totalRatings: 0,
                            averageRating: 0
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

                // Check if user already rated (stored locally)
                const savedUserRating = localStorage.getItem(userRatingKey);
                if (savedUserRating) {
                    setUserRating(parseInt(savedUserRating, 10));
                    setHasRated(true);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDataAndIncrementViews();
    }, [chapterId]);

    const handleRate = async (newRating) => {
        if (hasRated) return;

        const docId = getDocId(chapterId);
        const userRatingKey = `user-rating-${chapterId}`;
        
        try {
            const docRef = doc(db, 'chapters', docId);
            
            await runTransaction(db, async (transaction) => {
                const docSnap = await transaction.get(docRef);
                const data = docSnap.exists() ? docSnap.data() : { totalScore: 0, totalRatings: 0 };
                
                const newTotalScore = (data.totalScore || 0) + newRating;
                const newTotalRatings = (data.totalRatings || 0) + 1;
                const newAverageRating = newTotalScore / newTotalRatings;
                
                transaction.update(docRef, {
                    totalScore: newTotalScore,
                    totalRatings: newTotalRatings,
                    averageRating: newAverageRating
                });
                
                setRating(newAverageRating);
                setTotalRatings(newTotalRatings);
            });

            // Save user rating locally
            localStorage.setItem(userRatingKey, newRating.toString());
            setUserRating(newRating);
            setHasRated(true);
        } catch (error) {
            console.error('Error saving rating:', error);
        }
    };

    // ... rest of the component remains the same
};
```

---

## โครงสร้างข้อมูลใน Firestore

```
chapters (collection)
  └── chapter-introduction (document)
        ├── views: 1234
        ├── totalScore: 4320
        ├── totalRatings: 1000
        └── averageRating: 4.32
  └── chapter-1 (document)
        └── ...
```

---

## Security Rules (สำหรับ Production)

ไปที่ Firestore > Rules แล้วตั้งค่า:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chapters/{chapterId} {
      // อนุญาตให้อ่านได้ทุกคน
      allow read: if true;
      
      // อนุญาตให้เขียนเฉพาะการเพิ่ม views และ rating
      allow update: if request.resource.data.diff(resource.data).affectedKeys()
                      .hasOnly(['views', 'totalScore', 'totalRatings', 'averageRating']);
      
      // อนุญาตให้สร้าง document ใหม่
      allow create: if true;
    }
  }
}
```

---

## ทางเลือกอื่นๆ

| Service | ข้อดี | ข้อเสีย |
|---------|-------|---------|
| **Firebase** | ฟรี, ง่าย, Real-time | ต้อง Google account |
| **Supabase** | Open source, PostgreSQL | ซับซ้อนกว่า |
| **PlanetScale** | MySQL, Generous free tier | ต้องเขียน SQL |
| **MongoDB Atlas** | Flexible schema | ต้องเรียนรู้ MongoDB |

---

## สิ่งที่ต้องทำ

1. [ ] สร้าง Firebase project
2. [ ] ตั้งค่า Firestore Database  
3. [ ] ติดตั้ง firebase package
4. [ ] สร้างไฟล์ `src/firebase.js` 
5. [ ] อัพเดท `ChapterRating.jsx`
6. [ ] ทดสอบในเครื่อง
7. [ ] ตั้ง Security Rules ก่อน deploy

หากต้องการให้ช่วย implement แบบเต็ม บอกได้เลยครับ! 🚀
