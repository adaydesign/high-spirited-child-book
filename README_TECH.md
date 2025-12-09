# 🔧 เอกสารทางเทคนิค - อย่ากลัวเด็กดื้อ!

## สารบัญ

- [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
- [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
- [การติดตั้งและการพัฒนา](#การติดตั้งและการพัฒนา)
- [การ Build สำหรับ Production](#การ-build-สำหรับ-production)
- [การปรับแต่ง](#การปรับแต่ง)
- [API และ Components](#api-และ-components)

---

## เทคโนโลยีที่ใช้

| เทคโนโลยี | เวอร์ชัน | การใช้งาน |
|----------|---------|-----------|
| **Vite** | ^7.0 | Build tool และ Development server |
| **React** | ^19.0 | UI Framework |
| **React Router DOM** | ^7.0 | Client-side routing |
| **React Markdown** | ^10.0 | Markdown rendering |
| **Remark GFM** | ^4.0 | GitHub Flavored Markdown support |
| **jsPDF** | ^2.5 | PDF generation |
| **html2canvas** | ^1.4 | HTML to canvas (สำหรับ PDF) |

---

## โครงสร้างโปรเจกต์

```
my-book-3/
├── public/
│   ├── cover.png           # ภาพหน้าปกหนังสือ
│   ├── promo-banner.png    # ภาพประชาสัมพันธ์แบนเนอร์
│   ├── promo-square.png    # ภาพประชาสัมพันธ์สี่เหลี่ยม
│   └── favicon.svg         # Favicon
│
├── src/
│   ├── components/
│   │   ├── BookCover.jsx      # หน้าปกหนังสือ
│   │   ├── ChapterReader.jsx  # แสดงเนื้อหาจาก Markdown
│   │   ├── Navigation.jsx     # เมนูนำทาง Sidebar
│   │   ├── PDFDownload.jsx    # ปุ่มดาวน์โหลด PDF
│   │   └── ThemeToggle.jsx    # ปุ่มสลับธีม
│   │
│   ├── content/               # เนื้อหา Markdown
│   │   ├── cover.md
│   │   ├── preface.md
│   │   ├── toc.md
│   │   ├── introduction.md
│   │   ├── chapter1.md
│   │   ├── chapter2.md
│   │   ├── chapter3.md
│   │   ├── chapter4.md
│   │   ├── chapter5.md
│   │   ├── conclusion.md
│   │   └── references.md
│   │
│   ├── styles/
│   │   └── index.css         # Design System + CSS Variables
│   │
│   ├── App.jsx               # Main App component
│   └── main.jsx              # Entry point
│
├── index.html                # HTML template
├── package.json              # Dependencies
├── vite.config.js            # Vite configuration
├── README.md                 # เอกสารประชาสัมพันธ์
└── README_TECH.md            # เอกสารทางเทคนิค (ไฟล์นี้)
```

---

## การติดตั้งและการพัฒนา

### ความต้องการของระบบ

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### ขั้นตอนการติดตั้ง

```bash
# 1. Clone โปรเจกต์ (หรือสร้างใหม่)
git clone <repository-url>
cd my-book-3

# 2. ติดตั้ง dependencies
npm install

# 3. เริ่ม development server
npm run dev
```

### Development Commands

| คำสั่ง | รายละเอียด |
|--------|------------|
| `npm run dev` | เริ่ม development server (Hot Reload) |
| `npm run build` | สร้าง production build |
| `npm run preview` | แสดงตัวอย่าง production build |
| `npm run lint` | ตรวจสอบ code ด้วย ESLint |

---

## การ Build สำหรับ Production

```bash
# สร้าง production build
npm run build

# ผลลัพธ์จะอยู่ใน folder dist/
ls -la dist/
```

### การ Deploy

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Netlify:**
```bash
# ตั้งค่า build command: npm run build
# ตั้งค่า publish directory: dist
```

**Static Server:**
```bash
npm run build
npx serve dist
```

---

## การปรับแต่ง

### 1. เปลี่ยนสี Theme

แก้ไข CSS Variables ใน `src/styles/index.css`:

```css
:root {
  /* Primary Colors - สีหลัก */
  --primary-500: #e8751a;  /* สีส้ม */
  
  /* Accent Colors - สีเสริม */
  --accent-500: #14b88c;   /* สีเขียว-น้ำเงิน */
  
  /* Background */
  --bg-primary: #fffbf5;   /* พื้นหลัง Light Mode */
}

/* Dark Mode */
[data-theme="dark"] {
  --bg-primary: #1c1917;
}

/* Sepia Mode */
[data-theme="sepia"] {
  --bg-primary: #f4ecd8;
}
```

### 2. เพิ่มบทใหม่

1. สร้างไฟล์ `src/content/chapter6.md`
2. Import ใน `src/components/ChapterReader.jsx`:

```jsx
import chapter6Md from '../content/chapter6.md?raw';

const contentMap = {
  // ... existing chapters
  '/chapter/6': chapter6Md,
};
```

3. เพิ่มใน `src/components/Navigation.jsx`:

```jsx
const chapters = [
  // ... existing chapters
  { path: '/chapter/6', label: 'บทที่ 6: ชื่อบท', section: 'เนื้อหา' },
];
```

4. เพิ่ม Route ใน `src/App.jsx` (ถ้าจำเป็น)

### 3. เปลี่ยนฟอนต์

แก้ไขใน `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap" rel="stylesheet">
```

และใน `src/styles/index.css`:

```css
:root {
  --font-thai: 'YOUR_FONT', sans-serif;
}
```

---

## API และ Components

### Components

#### `<BookCover />`
แสดงหน้าปกหนังสือพร้อมภาพและ CTA button

#### `<ChapterReader />`
แสดงเนื้อหา Markdown พร้อมการนำทางระหว่างบท

| Props | ไม่มี - ใช้ `useLocation()` จาก React Router |
|-------|----------------------------------------------|

#### `<Navigation />`
เมนูนำทาง Sidebar

| Props | Type | รายละเอียด |
|-------|------|------------|
| `isOpen` | boolean | สถานะเปิด/ปิดเมนู |
| `onClose` | function | callback เมื่อปิดเมนู |

#### `<ThemeToggle />`
ปุ่มสลับธีม (Light/Dark/Sepia)

| Props | ไม่มี - ใช้ localStorage เก็บ preference |
|-------|------------------------------------------|

#### `<PDFDownload />`
ปุ่มดาวน์โหลด PDF

| Props | ไม่มี |
|-------|-------|

---

### CSS Variables ที่สำคัญ

```css
/* Typography */
--font-thai          /* ฟอนต์หลัก */
--text-base          /* ขนาดตัวอักษรปกติ */
--leading-relaxed    /* ระยะห่างบรรทัด */

/* Spacing */
--space-4            /* ระยะห่าง 1rem */
--container-max      /* ความกว้างเนื้อหา 800px */

/* Colors */
--primary-500        /* สีหลัก */
--text-primary       /* สีตัวอักษร */
--bg-primary         /* สีพื้นหลัง */
```

---

## การแก้ไขปัญหาที่พบบ่อย

### 1. ฟอนต์ไทยไม่แสดง

ตรวจสอบว่า Google Fonts โหลดถูกต้องใน `index.html`

### 2. Markdown ไม่ render

ต้อง import ด้วย `?raw` suffix:
```jsx
import content from './file.md?raw';  // ถูกต้อง
import content from './file.md';      // ผิด
```

### 3. PDF ภาษาไทยไม่แสดง

jsPDF ไม่รองรับภาษาไทยโดยตรง ต้องใช้ custom font หรือ html2canvas

---

## ติดต่อและสนับสนุน

- 📝 **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/your-repo/discussions)

---

*เอกสารอัปเดตล่าสุด: ธันวาคม 2024*
