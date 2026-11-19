import jsPDF from 'jspdf';
import 'jspdf-autotable';

export interface ReceiptData {
  receiptNumber: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  serviceCategory: string;
  appointmentDate: string;
  timeSlot: string;
  amount: number;
  currency?: string;
  stripeSessionId?: string;
}

export function generateSalonReceipt(data: ReceiptData): void {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(212, 115, 85); // Salon Rose Gold
  doc.rect(0, 0, 210, 40, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('SalonBook Luxury Aesthetics', 14, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Official Appointment & Payment Confirmation', 14, 32);

  // Metadata
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(11);
  doc.text(`Receipt Reference: #${data.receiptNumber}`, 14, 52);
  doc.text(`Issue Date: ${new Date().toLocaleDateString('en-US')}`, 14, 60);
  doc.text(`Guest Name: ${data.customerName}`, 14, 68);
  doc.text(`Guest Email: ${data.customerEmail}`, 14, 76);

  if (data.stripeSessionId) {
    doc.text(`Payment Gateway: Stripe Checkout Verified`, 14, 84);
  }

  // Service Table
  (doc as any).autoTable({
    startY: 94,
    head: [['Description', 'Category', 'Appointment Schedule', 'Amount (USD)']],
    body: [
      [
        data.serviceName,
        data.serviceCategory,
        `${data.appointmentDate} at ${data.timeSlot}`,
        `$${data.amount.toFixed(2)}`,
      ],
    ],
    theme: 'striped',
    headStyles: { fillColor: [52, 21, 13] }, // Salon dark
  });

  // Footer notes
  const finalY = (doc as any).lastAutoTable.finalY + 25;
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text('Thank you for reserving your beauty experience with SalonBook.', 14, finalY);
  doc.text('For rescheduling or custom inquiries: concierge@salonbook.com • +1 (555) 432-1098', 14, finalY + 6);

  doc.save(`SalonBook_Receipt_${data.receiptNumber}.pdf`);
}
