import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportComparisonToPDF(elementId: string, title: string = "LLM-Plattform-Vergleich") {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    
    // PDF setup (A4 landscape for better comparison view)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 297; // A4 landscape width
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add header
    pdf.setFontSize(18);
    pdf.setTextColor(15, 23, 42); // Slate-900
    pdf.text(title, 10, 15);
    
    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139); // Slate-500
    pdf.text(`Erstellt am ${new Date().toLocaleDateString('de-DE')}`, 10, 22);

    // Add image
    pdf.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight);
    
    // Add footer
    const pageHeight = pdf.internal.pageSize.height;
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184); // Slate-400
    pdf.text("Generiert mit LLM-Plattform-Vergleich - Alle Angaben ohne Gewähr.", 10, pageHeight - 10);

    pdf.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
