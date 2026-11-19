import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SalonBook - Luxury Salon Appointment Booking Platform',
  description: 'Book luxury haircuts, skin treatments, bridal makeup, massage, and spa appointments online.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-salon-50/30 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
