import api from "../../../services/api.js";

export async function createBooking(bookingData) {
  const response = await api.post("/api/bookings", bookingData);
  return response.data;
}

export async function getMyBookings() {
  const response = await api.get("/api/bookings/mine");
  return response.data;
}

export async function getOwnerBookings() {
  const response = await api.get("/api/bookings/owner");
  return response.data;
}

export async function acceptBooking(bookingId) {
  const response = await api.patch(`/api/bookings/${bookingId}/accept`);
  return response.data;
}

export async function rejectBooking(bookingId) {
  const response = await api.patch(`/api/bookings/${bookingId}/reject`);
  return response.data;
}

export async function cancelBooking(bookingId) {
  const response = await api.patch(`/api/bookings/${bookingId}/cancel`);
  return response.data;
}
