import { useState, useCallback } from 'react';
import jsPDF from 'jspdf';

// Thai font support - we'll use a built-in approach
const generatePDF = async (onProgress) => {
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    // Page dimensions
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    const lineHeight = 8;

    let yPosition = margin;

    // Helper to add new page if needed
    const checkNewPage = (neededSpace = lineHeight) => {
        if (yPosition + neededSpace > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
            return true;
        }
        return false;
    };

    // Helper to add text with Thai support indication
    const addText = (text, size = 12, isBold = false) => {
        pdf.setFontSize(size);
        if (isBold) {
            pdf.setFont('helvetica', 'bold');
        } else {
            pdf.setFont('helvetica', 'normal');
        }

        const lines = pdf.splitTextToSize(text, contentWidth);
        lines.forEach(line => {
            checkNewPage();
            pdf.text(line, margin, yPosition);
            yPosition += lineHeight * (size / 12);
        });
        yPosition += lineHeight * 0.5;
    };

    // Cover Page
    onProgress?.('กำลังสร้างหน้าปก...');
    pdf.setFillColor(255, 247, 237);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    yPosition = 60;
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(232, 117, 26);
    pdf.text('Don\'t Fear Stubborn Children!', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 15;
    pdf.setFontSize(18);
    pdf.setTextColor(87, 83, 78);
    pdf.text('Understanding High-Spirited Kids', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 25;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(232, 117, 26);
    pdf.text('"Transform stubborn into smart, brave, and capable"', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 40;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(87, 83, 78);
    pdf.text('A Guide for Parents of Children Ages 1-6', pageWidth / 2, yPosition, { align: 'center' });

    // Table of Contents
    onProgress?.('กำลังสร้างสารบัญ...');
    pdf.addPage();
    yPosition = margin;
    pdf.setTextColor(41, 37, 36);

    addText('TABLE OF CONTENTS', 20, true);
    yPosition += 10;

    const chapters = [
        'Preface',
        'Introduction: Why "Don\'t Fear Stubborn Children"',
        'Chapter 1: Understanding High-Spirited Children',
        'Chapter 2: Why They\'re Not "Stubborn"',
        'Chapter 3: Reading Situations and Understanding Your Child',
        'Chapter 4: Positive Parenting Techniques',
        'Chapter 5: Transforming Stubborn into Smart',
        'Conclusion',
        'References'
    ];

    chapters.forEach((chapter, i) => {
        checkNewPage();
        pdf.setFontSize(12);
        pdf.text(`${i + 1}. ${chapter}`, margin, yPosition);
        yPosition += lineHeight;
    });

    // Chapter summaries
    onProgress?.('กำลังสร้างเนื้อหาบท...');

    const chapterContents = [
        {
            title: 'Chapter 1: Understanding High-Spirited Children',
            content: `High-spirited children are those with characteristics that are "more" than typical children - more energy, more curiosity, more excitement. Research by Mary Sheedy Kurcinka explains that these children have emotions and behaviors that are about 10-15% more intense than average children.

Key characteristics include:
- Abundant energy - constantly moving, running, exploring
- Highly curious - asking "why?" repeatedly, wanting to understand everything
- Friendly with everyone - not afraid of strangers, socially engaging
- Independent thinkers - not easily compliant, need reasons
- Intense emotions - strong reactions to both joy and disappointment`
        },
        {
            title: 'Chapter 2: Why They\'re Not "Stubborn"',
            content: `When we call a child "stubborn," we often mean they don't follow instructions. But consider:
- A 2-year-old refusing to wear your chosen shirt = developing autonomy
- A 3-year-old asking "why?" constantly = learning about the world
- A 4-year-old running around the house = needing to release energy
- A 5-year-old unafraid of strangers = having strong social skills

These are normal developmental behaviors, just more intense. The prefrontal cortex, which controls impulse regulation, doesn't fully develop until around age 25.`
        },
        {
            title: 'Chapter 3: Reading Situations',
            content: `Use the STOP method:
S - Stop: Pause before reacting
T - Think: Consider what the child needs
O - Observe: Notice context, environment, emotional state
P - Plan: Choose an appropriate response

Practice active listening:
1. Stop what you're doing
2. Make eye contact at child's level
3. Nod to show attention
4. Reflect feelings: "It seems you're very upset"
5. Don't judge - listen first, advise later`
        },
        {
            title: 'Chapter 4: Positive Parenting Techniques',
            content: `10 Practical Techniques:
1. Give choices instead of commands
2. Tell them what TO do, not what NOT to do
3. Give advance warnings before transitions
4. Use games and fun
5. Acknowledge feelings before solving problems
6. Give meaningful tasks
7. Create predictable routines
8. Use natural consequences
9. Praise good behavior
10. Use Time-In instead of Time-Out`
        },
        {
            title: 'Chapter 5: Transforming Stubborn into Smart',
            content: `Hidden potential in high-spirited children:
- Won't comply easily → Leadership
- Asks questions constantly → Researcher mindset
- Endless energy → Athlete, creator
- Approaches everyone → Communicator, negotiator
- Intense emotions → Artist, performer
- Stubborn, persistent → Determination

Build Growth Mindset:
- Use the word "yet" - "You can't do it YET"
- Praise the process, not just results
- Share your own learning experiences`
        }
    ];

    for (const chapter of chapterContents) {
        pdf.addPage();
        yPosition = margin;

        addText(chapter.title, 18, true);
        yPosition += 5;

        const paragraphs = chapter.content.split('\n\n');
        paragraphs.forEach(para => {
            addText(para.trim(), 11);
            yPosition += 3;
        });
    }

    // Conclusion
    onProgress?.('กำลังสร้างบทสรุป...');
    pdf.addPage();
    yPosition = margin;

    addText('CONCLUSION', 20, true);
    yPosition += 10;

    addText('Key Takeaways:', 14, true);
    addText('1. High-spirited children are NOT stubborn - they are developing normally, just more intensely');
    addText('2. Understand before judging - every behavior has a reason');
    addText('3. Positive parenting works - give choices, listen, teach instead of punish');
    addText('4. Hidden potential exists in every behavior - today\'s challenges become tomorrow\'s strengths');

    yPosition += 10;
    addText('Remember: Children don\'t need perfect parents. They need parents who TRY and stay BY THEIR SIDE.');

    yPosition += 10;
    addText('"Don\'t fear stubborn children... because they are the future."', 12, true);

    // References
    onProgress?.('กำลังสร้างบรรณานุกรม...');
    pdf.addPage();
    yPosition = margin;

    addText('REFERENCES', 20, true);
    yPosition += 10;

    const references = [
        'Dweck, C. S. (2006). Mindset: The New Psychology of Success. Random House.',
        'Erikson, E. H. (1963). Childhood and Society. W.W. Norton & Company.',
        'Kurcinka, M. S. (2015). Raising Your Spirited Child. William Morrow.',
        'Siegel, D. J., & Bryson, T. P. (2011). The Whole-Brain Child. Bantam Books.',
        'Vygotsky, L. S. (1978). Mind in Society. Harvard University Press.',
        'Sanders, M. R. (2012). Triple P-Positive Parenting Program. Annual Review of Clinical Psychology.'
    ];

    references.forEach(ref => {
        addText(`• ${ref}`, 10);
    });

    onProgress?.('เสร็จสิ้น!');

    return pdf;
};

export default function PDFDownload() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState('');

    const handleDownload = useCallback(async () => {
        setIsGenerating(true);
        setProgress('เริ่มต้น...');

        try {
            const pdf = await generatePDF(setProgress);
            pdf.save('dont-fear-stubborn-children.pdf');
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('เกิดข้อผิดพลาดในการสร้าง PDF');
        } finally {
            setIsGenerating(false);
            setProgress('');
        }
    }, []);

    return (
        <button
            className="download-btn"
            onClick={handleDownload}
            disabled={isGenerating}
            title="ดาวน์โหลด PDF"
        >
            {isGenerating ? (
                <>
                    <span className="spinner-small"></span>
                    <span>{progress}</span>
                </>
            ) : (
                <>
                    📥 <span>ดาวน์โหลด PDF</span>
                </>
            )}
        </button>
    );
}
