// Appointment scheduling helper utilities and time-slot definitions

export interface AppointmentBookingPayload {
  serviceId: string;
  appointmentDate: string;
  timeSlot: string;
  message?: string;
}

export const PREDEFINED_TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:30 AM - 11:30 AM',
  '12:00 PM - 01:00 PM',
  '02:00 PM - 03:00 PM',
  '03:30 PM - 04:30 PM',
  '05:00 PM - 06:00 PM',
  '06:30 PM - 07:30 PM',
] as const;

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid';
