/**
 * Utility to generate and trigger download of an RFC 5545 .ics calendar event.
 * Compatible with Google Calendar, Apple Calendar, Outlook, and mobile devices.
 */

interface CalendarEventParams {
  title: string;
  description: string;
  location?: string;
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // e.g., "10:00 AM", "02:30 PM", or "14:00"
  durationMinutes: number;
}

export function exportAppointmentToIcs({
  title,
  description,
  location = 'SalonBook Luxury Aesthetics Studio, 452 Madison Ave, New York, NY',
  dateStr,
  timeStr,
  durationMinutes,
}: CalendarEventParams) {
  // Parse date and time to Date object
  let [hours, minutes] = [10, 0];
  const timeUpper = timeStr.toUpperCase();
  const isPM = timeUpper.includes('PM');
  const isAM = timeUpper.includes('AM');

  const cleanTime = timeStr.replace(/(AM|PM)/gi, '').trim();
  const parts = cleanTime.split(':').map((p) => parseInt(p, 10));

  if (parts.length >= 2) {
    hours = parts[0];
    minutes = parts[1];
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
  }

  const [year, month, day] = dateStr.split('-').map((n) => parseInt(n, 10));
  const startDate = new Date(year, month - 1, day, hours, minutes);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

  const formatIcsDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SalonBook//Appointment Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:salonbook-${Date.now()}@salonbook.com`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${title} at SalonBook in 2 hours`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-appointment.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
