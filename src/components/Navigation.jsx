import { Link, useLocation } from 'react-router-dom';

const chapters = [
  { path: '/', label: '📖 หน้าปก', section: 'หน้าแรก' },
  { path: '/preface', label: 'คำนำ', section: 'ส่วนนำ' },
  { path: '/toc', label: 'สารบัญ', section: 'ส่วนนำ' },
  { path: '/introduction', label: 'บทนำ', section: 'ส่วนนำ' },
  { path: '/chapter/1', label: 'บทที่ 1: รู้จักเด็กพลังงานสูง', section: 'เนื้อหา' },
  { path: '/chapter/2', label: 'บทที่ 2: ทำไมเขาไม่ใช่เด็กดื้อ', section: 'เนื้อหา' },
  { path: '/chapter/3', label: 'บทที่ 3: อ่านสถานการณ์และเข้าใจลูก', section: 'เนื้อหา' },
  { path: '/chapter/4', label: 'บทที่ 4: เทคนิคการเลี้ยงดูเชิงบวก', section: 'เนื้อหา' },
  { path: '/chapter/5', label: 'บทที่ 5: เปลี่ยนเด็กดื้อให้เป็นเด็กฉลาด', section: 'เนื้อหา' },
  { path: '/conclusion', label: 'บทสรุป', section: 'ส่วนท้าย' },
  { path: '/references', label: 'บรรณานุกรม', section: 'ส่วนท้าย' },
];

export default function Navigation({ isOpen, onClose }) {
  const location = useLocation();
  
  // Group chapters by section
  const sections = chapters.reduce((acc, chapter) => {
    if (!acc[chapter.section]) {
      acc[chapter.section] = [];
    }
    acc[chapter.section].push(chapter);
    return acc;
  }, {});
  
  return (
    <>
      <div 
        className={`nav-menu-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />
      <nav className={`nav-menu ${isOpen ? 'open' : ''}`}>
        {Object.entries(sections).map(([section, items]) => (
          <div key={section}>
            <div className="nav-section-title">{section}</div>
            <ul className="nav-list">
              {items.map((chapter) => (
                <li key={chapter.path} className="nav-item">
                  <Link
                    to={chapter.path}
                    className={`nav-link ${location.pathname === chapter.path ? 'active' : ''}`}
                    onClick={onClose}
                  >
                    {chapter.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );
}

export { chapters };
