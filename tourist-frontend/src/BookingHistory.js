import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const roleHeader = userStr ? JSON.parse(userStr).role : "ROLE_TOURIST";

    fetch("http://localhost:8080/booking/all", {
      headers: { "X-User-Role": roleHeader }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => setBookings(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Your Bookings</h2>

        {bookings.map((b) => (
          <div key={b.bookingId} style={styles.card}>
            <p>Booking ID: {b.bookingId}</p>
            <p>Status: {b.status}</p>
            <p>Date: {b.bookingDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  }
};

export default BookingHistory;