export interface IBooking {
  _id: string;
  email?: string;
  customerEmail?: string;
  ownerEmail?: string;
  ownerName?: string;
  name?: string;
  image?: string;
  studioId?: string;
  studioTitle?: string;
  studioImage?: string;
  title?: string;
  imageUrl?: string;
  location?: string;
  date?: string;
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  totalPrice?: number;
  price?: number;
  status?: string;
  isHostNotification?: boolean;
  bookingRef?: string;
  guestEmail?: string;
  guestName?: string;
  createdAt?: string;
  updatedAt?: string;
}
