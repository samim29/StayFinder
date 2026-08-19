/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <BookingContext.Provider
      value={{ bookings, setBookings, loading, setLoading }}
    >
      {children}
    </BookingContext.Provider>
  );
};
